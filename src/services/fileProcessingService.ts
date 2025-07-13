import { SchemaField } from '@/types';

export class FileProcessingService {
  /**
   * Processes the file using the backend API and extracts the schema from the response headers.
   */
  async processFile(file: File): Promise<{ convertedFile: File, schema: SchemaField[] }> {
    console.log('🔄 Calling backend to process file:', file.name);

    const formData = new FormData();
    formData.append('shapefile', file);

    const response = await fetch('/api/convert-upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`File conversion failed on the server: ${errorText}`);
    }

    // Extract the schema from the custom header
    const schemaHeader = response.headers.get('X-Generated-Schema');
    let schema: SchemaField[] = [];
    if (schemaHeader) {
        try {
            schema = JSON.parse(schemaHeader);
            console.log('✅ Received schema from backend:', schema);
        } catch (e) {
            console.warn('Could not parse schema from header:', e);
            // Fallback to auto-detection if the header is malformed
            schema = []; 
        }
    } else {
        console.warn('No schema header found in the response. BigQuery will use auto-detection.');
    }

    // The backend sends the converted file directly. Handle it as a blob.
    const blob = await response.blob();
    const convertedFile = new File([blob], `${file.name}.geojson`, { type: 'application/geo+json' });
    
    console.log('✅ Backend conversion successful. Received converted file.');
    
    return { convertedFile, schema };
  }

  // The rest of the functions remain the same...
  async processGcsFile(
    gcsBucket: string,
    gcsPath: string
  ): Promise<{ processedFileUrl: string; processedFileName: string }> {
    // This function remains for potential future use but is not part of the primary local upload flow.
    console.log(`🔄 Calling backend to process GCS file: gs://${gcsBucket}/${gcsPath}`);
    
    const response = await fetch('/api/convert-gcs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bucket: gcsBucket, path: gcsPath }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'GCS file conversion failed on the server.');
    }

    const result = await response.json();
    return {
        processedFileUrl: result.gcsUri,
        processedFileName: result.gcsUri.split('/').pop()
    };
  }

  private inferSchema(records: any[]): SchemaField[] {
    return [];
  }

  async validateProcessedFile(gcsUri: string): Promise<boolean> {
    return !!gcsUri;
  }
}

export const fileProcessingService = new FileProcessingService();