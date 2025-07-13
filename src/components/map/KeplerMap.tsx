import React from 'react';

interface KeplerMapProps {
  data?: any;
  height?: string | number;
  width?: string | number;
  mapboxApiAccessToken?: string;
  onMapLoad?: (map: any) => void;
}

const KeplerMap: React.FC<KeplerMapProps> = ({
  data,
  height = '100vh',
  width = '100%',
  mapboxApiAccessToken,
  onMapLoad,
}) => {
  return (
    <div style={{ position: 'relative', width, height }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        background: '#f0f0f0',
        color: '#666',
        fontSize: '16px'
      }}>
        Map Component Placeholder
      </div>
    </div>
  );
};

export default KeplerMap;