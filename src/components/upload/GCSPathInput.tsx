import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FolderOpen, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GCSPathInputProps {
  bucket: string;
  path: string;
  onBucketChange: (bucket: string) => void;
  onPathChange: (path: string) => void;
  disabled?: boolean;
}

const GCSPathInput: React.FC<GCSPathInputProps> = ({
  bucket,
  path,
  onBucketChange,
  onPathChange,
  disabled = false
}) => {
  const fullPath = bucket && path ? `gs://${bucket}/${path}` : '';

  return (
    <Card data-id="svn044coz" data-path="src/components/upload/GCSPathInput.tsx">
      <CardHeader data-id="oq7dv57ux" data-path="src/components/upload/GCSPathInput.tsx">
        <CardTitle className="flex items-center space-x-2" data-id="lba75fydb" data-path="src/components/upload/GCSPathInput.tsx">
          <FolderOpen className="h-5 w-5" data-id="ptppav4p1" data-path="src/components/upload/GCSPathInput.tsx" />
          <span data-id="2wh7yk7e7" data-path="src/components/upload/GCSPathInput.tsx">Google Cloud Storage Path</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4" data-id="r2qcvddw2" data-path="src/components/upload/GCSPathInput.tsx">
        <Alert data-id="0901ivmrz" data-path="src/components/upload/GCSPathInput.tsx">
          <Info className="h-4 w-4" data-id="byz4ooi9s" data-path="src/components/upload/GCSPathInput.tsx" />
          <AlertDescription data-id="tu2733mfr" data-path="src/components/upload/GCSPathInput.tsx">
            Specify the GCS bucket and path where your zipped shapefile(s) are stored.
            Use wildcards (*) to process multiple files.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4" data-id="mlbqg46h1" data-path="src/components/upload/GCSPathInput.tsx">
          <div className="space-y-2" data-id="jhi9u50iw" data-path="src/components/upload/GCSPathInput.tsx">
            <Label htmlFor="gcs-bucket" data-id="nmp2zm51n" data-path="src/components/upload/GCSPathInput.tsx">GCS Bucket Name</Label>
            <Input
              id="gcs-bucket"
              placeholder="my-geospatial-data"
              value={bucket}
              onChange={(e) => onBucketChange(e.target.value)}
              disabled={disabled} data-id="0el8ya8g8" data-path="src/components/upload/GCSPathInput.tsx" />

          </div>

          <div className="space-y-2" data-id="laukz229k" data-path="src/components/upload/GCSPathInput.tsx">
            <Label htmlFor="gcs-path" data-id="3baav5rh1" data-path="src/components/upload/GCSPathInput.tsx">Path/Pattern</Label>
            <Input
              id="gcs-path"
              placeholder="shapefiles/*.zip or path/to/specific/file.zip"
              value={path}
              onChange={(e) => onPathChange(e.target.value)}
              disabled={disabled} data-id="ug78m81aj" data-path="src/components/upload/GCSPathInput.tsx" />

          </div>

          {fullPath &&
          <div className="p-3 bg-gray-50 rounded-lg" data-id="9z7wsf4pg" data-path="src/components/upload/GCSPathInput.tsx">
              <Label className="text-xs text-gray-500" data-id="t13kpp6yz" data-path="src/components/upload/GCSPathInput.tsx">Full GCS Path:</Label>
              <p className="font-mono text-sm text-gray-800 break-all" data-id="41txhcbwq" data-path="src/components/upload/GCSPathInput.tsx">{fullPath}</p>
            </div>
          }
        </div>

        <div className="space-y-2" data-id="zebcxo3m8" data-path="src/components/upload/GCSPathInput.tsx">
          <h4 className="text-sm font-medium text-gray-700" data-id="teio3xjwp" data-path="src/components/upload/GCSPathInput.tsx">Examples:</h4>
          <div className="space-y-1 text-xs text-gray-500" data-id="uyndb1sma" data-path="src/components/upload/GCSPathInput.tsx">
            <p data-id="j6irnpuv7" data-path="src/components/upload/GCSPathInput.tsx"><code data-id="49nro0y2c" data-path="src/components/upload/GCSPathInput.tsx">gs://my-bucket/data/*.zip</code> - Process all .zip files in the data folder</p>
            <p data-id="gda35779i" data-path="src/components/upload/GCSPathInput.tsx"><code data-id="7wq2943n6" data-path="src/components/upload/GCSPathInput.tsx">gs://my-bucket/cities.zip</code> - Process a specific zipped shapefile</p>
            <p data-id="3y1sp8pik" data-path="src/components/upload/GCSPathInput.tsx"><code data-id="bh739uonq" data-path="src/components/upload/GCSPathInput.tsx">gs://my-bucket/regions/**/*.zip</code> - Process all .zip files recursively</p>
          </div>
        </div>
      </CardContent>
    </Card>);

};

export default GCSPathInput;