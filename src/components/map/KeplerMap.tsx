import React, { useCallback, useMemo, useRef } from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import keplerGlReducer from 'kepler.gl/reducers';
import { addDataToMap, toggleModal } from 'kepler.gl/actions';
import { processCsvData } from 'kepler.gl/processors';
import { KeplerGl } from 'kepler.gl';

// Custom middleware to handle actions
const customMiddleware = store => next => action => {
  // Add any custom action handling here
  return next(action);
};

// Create store with middleware
const reducers = combineReducers({
  keplerGl: keplerGlReducer,
});

// Type declaration for Redux DevTools extension
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: typeof compose;
  }
}

// Create the store with middleware and dev tools
const composeEnhancers = 
  (typeof window !== 'undefined' && 
   window.__REDUX_DEVTOOLS_EXTENSION__) || compose;

const store = createStore(
  reducers,
  {},
  composeEnhancers(
    applyMiddleware(customMiddleware)
  )
);

// Default map style using OpenStreetMap
const DEFAULT_MAP_STYLES = {
  light: {
    id: 'light',
    label: 'Light',
    url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
    icon: 'https://api.maptiler.com/maps/streets/256/0/0/0.png?key=no-token',
  },
  dark: {
    id: 'dark',
    label: 'Dark',
    url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    icon: 'https://api.maptiler.com/maps/streets/256/0/0/0.png?key=no-token',
  },
  satellite: {
    id: 'satellite',
    label: 'Satellite',
    url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
    icon: 'https://api.maptiler.com/maps/hybrid/256/0/0/0.jpg?key=no-token',
  },
};

const INITIAL_VIEW_STATE = {
  latitude: 20.5937, // Center of India
  longitude: 78.9629,
  zoom: 4,
  pitch: 0,
  bearing: 0,
  minZoom: 2,
  maxZoom: 24,
};

const MAPBOX_TOKEN = ''; // Not needed for OSM tiles

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
  mapboxApiAccessToken = MAPBOX_TOKEN,
  onMapLoad,
}) => {
  const dispatch = useDispatch();
  const mapRef = useRef();

  // Process and add data to the map
  const processAndAddData = useCallback(
    (dataToProcess) => {
      if (!dataToProcess) return;

      const datasets = Array.isArray(dataToProcess) ? dataToProcess : [dataToProcess];
      
      const processedDatasets = datasets.map((dataset) => {
        if (dataset.info && dataset.data) {
          return dataset;
        }
        // Process CSV data if needed
        if (dataset.info && dataset.info.fileType === 'csv') {
          return {
            info: dataset.info,
            data: processCsvData(dataset.data),
          };
        }
        return {
          info: {
            id: dataset.id || 'geojson-data',
            label: dataset.label || 'GeoJSON Data',
          },
          data: dataset,
        };
      });

      dispatch(
        addDataToMap({
          datasets: processedDatasets,
          options: {
            centerMap: true,
            readOnly: false,
          },
          config: {
            version: 'v1',
            config: {
              visState: {
                layers: processedDatasets.map((dataset, index) => ({
                  id: `layer-${index}`,
                  type: 'geojson',
                  config: {
                    dataId: dataset.info.id,
                    label: dataset.info.label || `Layer ${index + 1}`,
                    color: [
                      Math.floor(Math.random() * 255),
                      Math.floor(Math.random() * 255),
                      Math.floor(Math.random() * 255),
                    ],
                    columns: {
                      geojson: '_geojson',
                    },
                    isVisible: true,
                    visConfig: {
                      filled: true,
                      stroke: true,
                      opacity: 0.8,
                      strokeOpacity: 0.8,
                      thickness: 1,
                      sizeRange: [0, 10],
                      radius: 10,
                      enable3d: false,
                      wireframe: false,
                    },
                  },
                })),
                interactionConfig: {
                  tooltip: {
                    fieldsToShow: {},
                    compareMode: false,
                    compareType: 'absolute',
                    enabled: true,
                  },
                  brush: {
                    size: 0.5,
                    enabled: false,
                  },
                  geocoder: {
                    enabled: false,
                  },
                  coordinate: {
                    enabled: false,
                  },
                },
              },
              mapState: {
                bearing: 0,
                dragRotate: false,
                latitude: INITIAL_VIEW_STATE.latitude,
                longitude: INITIAL_VIEW_STATE.longitude,
                pitch: 0,
                zoom: INITIAL_VIEW_STATE.zoom,
                isSplit: false,
              },
              mapStyle: {
                styleType: 'light',
                topLayerGroups: {},
                visibleLayerGroups: {
                  label: true,
                  road: true,
                  border: false,
                  building: true,
                  water: true,
                  land: true,
                  '3d building': false,
                },
                mapStyles: {
                  light: DEFAULT_MAP_STYLES.light,
                  dark: DEFAULT_MAP_STYLES.dark,
                  satellite: DEFAULT_MAP_STYLES.satellite,
                },
              },
            },
          },
        })
      );
    },
    [dispatch]
  );

  // Handle map load
  const handleMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
      if (onMapLoad) {
        onMapLoad(map);
      }
    },
    [onMapLoad]
  );

  // Process data when it changes
  React.useEffect(() => {
    if (data) {
      processAndAddData(data);
    }
  }, [data, processAndAddData]);

  return (
    <div style={{ position: 'relative', width, height }}>
      <KeplerGl
        id="kepler-gl"
        mapboxApiAccessToken={mapboxApiAccessToken}
        width="100%"
        height="100%"
        version="v1"
        mapStyles={DEFAULT_MAP_STYLES}
        mapStyle={DEFAULT_MAP_STYLES.light}
        onLoad={handleMapLoad}
        onViewStateChange={({ viewState }) => {
          // Handle view state changes if needed
        }}
        getMapboxRef={(map) => {
          // Store map reference
          if (map && !mapRef.current) {
            handleMapLoad(map);
          }
        }}
      />
    </div>
  );
};

// Wrapper component to provide Redux store
const KeplerMapWithProvider: React.FC<KeplerMapProps> = (props) => {
  return (
    <Provider store={store}>
      <KeplerMap {...props} />
    </Provider>
  );
};

export default KeplerMapWithProvider;
