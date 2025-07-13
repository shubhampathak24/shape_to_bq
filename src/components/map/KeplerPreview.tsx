import React from 'react';

interface KeplerPreviewProps {
  geojson: any;
  height?: string | number;
  width?: string | number;
  onMapLoad?: (map: any) => void;
}

const KeplerPreview: React.FC<KeplerPreviewProps> = ({
  geojson,
  height = '100vh',
  width = '100%',
  onMapLoad,
}) => {
  return (
    <div style={{ position: 'relative', width, height }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        background: '#f7f7f7',
        color: '#666',
        fontSize: '16px',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <div className="text-center">
          <div className="mb-4">🗺️</div>
          <div>Map Preview</div>
          <div className="text-sm text-gray-500 mt-2">
            {geojson ? `${geojson.features?.length || 0} features loaded` : 'No data to display'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeplerPreview;