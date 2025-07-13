import React, { lazy, Suspense } from 'react';

// Import KeplerMap with React.lazy for code splitting
const KeplerMap = lazy(() => import('./KeplerMap'));

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
      <Suspense fallback={<div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        background: '#f7f7f7',
        color: '#666',
        fontSize: '16px'
      }}>Loading map...</div>}>
        <KeplerMap
          data={geojson}
          height={height}
          width={width}
          onMapLoad={onMapLoad}
          mapboxApiAccessToken="" // Not needed for OSM tiles
        />
      </Suspense>
    </div>
  );
};

export default KeplerPreview;
