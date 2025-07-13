// Default map view settings
export const INITIAL_VIEW_STATE = {
  latitude: 20.5937,  // Center of India
  longitude: 78.9629,
  zoom: 4,
  pitch: 0,
  bearing: 0,
  minZoom: 2,
  maxZoom: 20
};

// Free map style using OpenStreetMap
export const MAP_STYLE = {
  version: 8,
  name: 'OpenStreetMap',
  sources: {
    'osm': {
      type: 'raster',
      tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap Contributors',
      maxzoom: 19
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

// Default map style configuration
export const MAP_STYLE_CONFIG = {
  version: 8,
  name: 'Empty',
  center: [0, 0],
  zoom: 1,
  sources: {},
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': 'white'
      }
    }
  ]
};
