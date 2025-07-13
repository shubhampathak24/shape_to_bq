const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { BigQuery } = require('@google-cloud/bigquery');
// Ensure fetch is available (Node 18+ has it natively)
if (typeof fetch === 'undefined') {
  global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}
const execPromise = promisify(require('child_process').exec);

const app = express();
// Disable automatic ETag generation so the browser always receives a full 200 JSON response
app.disable('etag');

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Configure multer with a new file size limit of 500MB
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB limit
});

// --- Helper Function to convert GeoJSON geometry to WKT ---
function geojsonToWkt(geometry) {
    if (!geometry || !geometry.type || !geometry.coordinates) {
        return null;
    }
    const type = geometry.type.toUpperCase();
    const coords = geometry.coordinates;
    const stringifyPoints = (points) => points.map(p => p.join(' ')).join(', ');

    switch (type) {
        case 'POINT': return `POINT(${coords.join(' ')})`;
        case 'LINESTRING': return `LINESTRING(${stringifyPoints(coords)})`;
        case 'POLYGON': return `POLYGON(${coords.map(ring => `(${stringifyPoints(ring)})`).join(', ')})`;
        case 'MULTIPOINT': return `MULTIPOINT(${stringifyPoints(coords)})`;
        case 'MULTILINESTRING': return `MULTILINESTRING(${coords.map(line => `(${stringifyPoints(line)})`).join(', ')})`;
        case 'MULTIPOLYGON': return `MULTIPOLYGON(${coords.map(polygon => `(${polygon.map(ring => `(${stringifyPoints(ring)})`).join(', ')})`).join(', ')})`;
        default: console.warn(`Unsupported geometry type: ${geometry.type}`); return null;
    }
}


app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/convert-upload', upload.single('shapefile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const tempDir = path.join(__dirname, 'uploads', `unzipped-${Date.now()}`);
    const inputFile = req.file.path;
    const outputNDJSON = path.join(tempDir, 'output.ndjson');

    try {
        await fs.promises.mkdir(tempDir, { recursive: true });
        await execPromise(`unzip -j "${inputFile}" -d "${tempDir}"`);

        const allFiles = await fs.promises.readdir(tempDir);
        const shpFiles = allFiles.filter(file => file.toLowerCase().endsWith('.shp'));

        if (shpFiles.length === 0) {
            throw new Error('No .shp files found in the zip archive.');
        }
        console.log(`Found ${shpFiles.length} shapefile(s):`, shpFiles);

        // --- Step 1: Convert all shapefiles to GeoJSON, fixing invalid geometries ---
        const conversionPromises = shpFiles.map((shpFile, index) => {
            const shpFilePath = path.join(tempDir, shpFile);
            const intermediateGeoJSON = path.join(tempDir, `intermediate-${index}.geojson`);
            const command = `/usr/bin/ogr2ogr`;
            
            // This fix ensures that any invalid geometries (like polygons with duplicate
            // vertices) are automatically repaired during the conversion process.
            const args = [
                '-f', 'GeoJSON',
                '-t_srs', 'EPSG:4326',
                '-lco', 'RFC7946=YES', // Enforces correct polygon winding order
                '-makevalid',          // Repairs invalid geometries
                intermediateGeoJSON,
                shpFilePath
            ];
            
            const ogr2ogrProcess = spawn(command, args);
            let stderr = '';
            ogr2ogrProcess.stderr.on('data', (data) => { stderr += data.toString(); });
            
            return new Promise((resolve, reject) => {
                ogr2ogrProcess.on('close', (code) => {
                    if (code === 0) resolve(intermediateGeoJSON);
                    else reject(new Error(`ogr2ogr failed for ${shpFilePath}:
${stderr}`));
                });
            });
        });
        const intermediateGeoJSONFiles = await Promise.all(conversionPromises);

        // --- Destination Handling: PostgreSQL vs BigQuery ---
        const destination = (req.body.destination || 'bigquery').toLowerCase();
        if (destination === 'postgres') {
            const {
                pgHost,
                pgPort = 5432,
                pgDatabase,
                pgUser,
                pgPassword,
                pgTable = `imported_data_${Date.now()}`
            } = req.body;

            if (!pgHost || !pgDatabase || !pgUser || !pgPassword) {
                throw new Error('PostgreSQL connection details missing.');
            }

            const connectionString = `PG:host=${pgHost} port=${pgPort} dbname=${pgDatabase} user=${pgUser} password=${pgPassword}`;
            const tableNames = [];
            for (let i = 0; i < intermediateGeoJSONFiles.length; i++) {
                const geoFile = intermediateGeoJSONFiles[i];
                const tableName = intermediateGeoJSONFiles.length === 1 ? pgTable : `${pgTable}_${i}`;
                tableNames.push(tableName);

                await new Promise((resolve, reject) => {
                    const args = [
                        '-f', 'PostgreSQL',
                        connectionString,
                        geoFile,
                        '-nln', tableName,
                        '-overwrite',
                        '-lco', 'GEOMETRY_NAME=geom',
                        '-lco', 'SPATIAL_INDEX=GIST'
                    ];
                    const proc = spawn('/usr/bin/ogr2ogr', args);
                    let stderr = '';
                    proc.stderr.on('data', d => { stderr += d.toString(); });
                    proc.on('close', code => {
                        if (code === 0) resolve();
                        else reject(new Error(`ogr2ogr Postgres load failed: ${stderr}`));
                    });
                });
            }

            console.log('✅ Loaded data into PostgreSQL tables:', tableNames);

            // Provide a small sample back to the client for immediate map preview
            const previewGeoJSON = JSON.parse(await fs.promises.readFile(intermediateGeoJSONFiles[0], 'utf8'));

            // Clean up temporary resources
            fs.unlink(inputFile, () => {});
            fs.rm(tempDir, { recursive: true, force: true }, () => {});

            return res.json({ message: 'Data loaded into PostgreSQL', tables: tableNames, preview: previewGeoJSON });
        }
        // --- BigQuery path continues ---

        // --- Step 2: Process all GeoJSON files into a single NDJSON with WKT ---
        const writeStream = fs.createWriteStream(outputNDJSON);
        const allProperties = new Set();
        for (const geojsonFile of intermediateGeoJSONFiles) {
            const geojsonData = await fs.promises.readFile(geojsonFile, 'utf8');
            const featureCollection = JSON.parse(geojsonData);
            
            for (const feature of featureCollection.features) {
                Object.keys(feature.properties).forEach(key => allProperties.add(key));
                const wktString = geojsonToWkt(feature.geometry);
                
                if (wktString) {
                    const featureForBigQuery = { ...feature.properties, geometry: wktString };
                    writeStream.write(JSON.stringify(featureForBigQuery) + '\n');
                }
            }
        }
        
        writeStream.end();
        await new Promise(resolve => writeStream.on('finish', resolve));
        console.log('Successfully created final NDJSON file.');

        // --- Step 3: Send the generated schema and the final file ---
        const bqSchema = Array.from(allProperties).map(name => ({ name, type: 'STRING' }));
        bqSchema.push({ name: 'geometry', type: 'GEOGRAPHY' });

        console.log('Generated BigQuery Schema:', bqSchema);

        res.set('Access-Control-Expose-Headers', 'X-Generated-Schema');
        res.set('X-Generated-Schema', JSON.stringify(bqSchema));
        
        res.sendFile(path.resolve(outputNDJSON), (err) => {
            fs.unlink(inputFile, () => {});
            fs.rm(tempDir, { recursive: true, force: true }, () => {});
        });

    } catch (error) {
        console.error('--- PROCESSING FAILED ---', error);
        fs.unlink(inputFile, () => {});
        if (fs.existsSync(tempDir)) {
          fs.rm(tempDir, { recursive: true, force: true }, () => {});
        }
        res.status(500).json({ message: 'File conversion failed on the server', error: error.message });
    }
});


// --- Preview GeoJSON endpoint ---
app.get('/api/preview-geojson', async (req, res) => {
  try {
    const { gcpProjectId, targetTable } = req.query;
    if (!gcpProjectId || !targetTable) {
      return res.status(400).json({ error: 'Missing gcpProjectId or targetTable' });
    }
    const [datasetId, tableId] = (targetTable || '').split('.');
    if (!datasetId || !tableId) {
      return res.status(400).json({ error: 'targetTable must be dataset.table' });
    }

    // Bearer token from OAuth-based front-end authentication
    const authHeader = req.headers['authorization'] || '';
    console.log('Auth header:', authHeader);
    const match = typeof authHeader === 'string' ? authHeader.match(/^Bearer\s+(.*)$/i) : null;
    const accessToken = match ? match[1] : null;

    const limitParam = req.query.limit ? Number(req.query.limit) : null;
    const sql = `SELECT *, ST_ASGEOJSON(geometry) AS geojson
                 FROM \`${gcpProjectId}.${datasetId}.${tableId}\`
                 ${limitParam && limitParam > 0 ? `LIMIT ${limitParam}` : ''}`;

    let rows;

    if (accessToken) {
      // Use the end-user access token to query BigQuery directly via REST
      const response = await fetch(`https://bigquery.googleapis.com/bigquery/v2/projects/${gcpProjectId}/queries`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sql, useLegacySql: false })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('BigQuery REST query failed:', response.status, errText);
        return res.status(500).json({ error: 'BigQuery query failed' });
      }

      const data = await response.json();
      const fields = data.schema.fields.map(f => f.name);
      rows = (data.rows || []).map((r) => {
        const obj = {};
        r.f.forEach((v, idx) => { obj[fields[idx]] = v.v; });
        return obj;
      });
    } else {
      // Fallback to service / ADC credentials if they exist
      const bq = new BigQuery({ projectId: gcpProjectId });
      [rows] = await bq.query({ query: sql, useLegacySql: false });
    }

    const features = rows.map((row) => {
      const { geojson, geometry, ...props } = row;
      return {
        type: 'Feature',
        geometry: JSON.parse(geojson),
        properties: props,
      };
    });

    // Prevent intermediary or browser caching of this dynamic GeoJSON response
res.set('Cache-Control', 'no-store');
return res.json({ type: 'FeatureCollection', features });
  } catch (err) {
    console.error('Preview endpoint failed:', err);
    return res.status(500).json({ error: 'Failed to generate preview' });
  }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
