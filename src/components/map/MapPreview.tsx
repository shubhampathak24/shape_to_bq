import React, { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L, { GeoJsonObject } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPreviewProps {
  geojson: GeoJsonObject | null;
  height?: string; // tailwind height class e.g. "h-96"
}

// Fix default marker icon issues when using leaflet with bundlers
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapPreview: React.FC<MapPreviewProps> = ({ geojson, height = 'h-96' }) => {
  const mapRef = React.useRef<L.Map | null>(null);

  useEffect(() => {
    if (geojson && mapRef.current) {
      const layer = new L.GeoJSON(geojson);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [geojson]);

  if (!geojson) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 rounded-md ${height}`}>
        <p className="text-sm text-muted-foreground">No preview available.</p>
      </div>
    );
  }

  return (
    <MapContainer
      className={height + ' rounded-md overflow-hidden'}
      center={[0, 0]}
      zoom={2}
      scrollWheelZoom
      whenCreated={(map) => (mapRef.current = map)}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <GeoJSON data={geojson} style={{ color: '#00E0FF', weight: 2 }} />
    </MapContainer>
  );
};

export default MapPreview;
