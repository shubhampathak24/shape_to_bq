import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Polyfills for Node.js modules
      'path': 'path-browserify',
      'crypto': 'crypto-browserify',
      'stream': 'stream-browserify',
      'util': 'util',
      'buffer': 'buffer',
      'process': 'process/browser',
      'os': 'os-browserify/browser',
      'url': 'rollup-plugin-node-polyfills/polyfills/url',
      'string_decoder': 'rollup-plugin-node-polyfills/polyfills/string-decoder',
      'http': 'rollup-plugin-node-polyfills/polyfills/http',
      'https': 'rollup-plugin-node-polyfills/polyfills/http',
      'zlib': 'rollup-plugin-node-polyfills/polyfills/zlib',
      'timers': 'rollup-plugin-node-polyfills/polyfills/timers',
      'fs': 'rollup-plugin-node-polyfills/polyfills/empty',
      'net': 'rollup-plugin-node-polyfills/polyfills/empty',
      'tls': 'rollup-plugin-node-polyfills/polyfills/empty',
      'child_process': 'rollup-plugin-node-polyfills/polyfills/empty',
      'dns': 'rollup-plugin-node-polyfills/polyfills/empty',
      'dgram': 'rollup-plugin-node-polyfills/polyfills/empty',
      'module': 'rollup-plugin-node-polyfills/polyfills/empty',
      "../text-encoding/btoa.node": path.resolve(__dirname, "./src/shims/btoa-node.ts"),
      "./readable-stream-polyfill": path.resolve(__dirname, "./src/shims/readable-stream-polyfill.ts"),
      "./blob-polyfill": path.resolve(__dirname, "./src/shims/blob-polyfill.ts"),
      "./file-polyfill": path.resolve(__dirname, "./src/shims/file-polyfill.ts"),
      "./images-node/encode-image.node": path.resolve(__dirname, "./src/shims/encode-image-node.ts"),
      "./images-node/parse-image.node": path.resolve(__dirname, "./src/shims/parse-image-node.ts")
    }
  },
  define: {
    'process.env': {},
    'process.platform': '\'browser\'',
    'process.browser': true,
    global: 'globalThis',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    include: [
      'kepler.gl',
      'react-map-gl',
      'deck.gl',
      '@deck.gl/core',
      '@deck.gl/layers',
      '@deck.gl/aggregation-layers',
      '@deck.gl/mapbox',
      '@loaders.gl/core',
      '@loaders.gl/csv',
      '@loaders.gl/geopackage',
      '@loaders.gl/geojson',
      '@loaders.gl/kml',
      '@loaders.gl/shapefile',
      '@loaders.gl/zip',
      '@mapbox/tiny-sdf',
      'd3-array',
      'd3-scale',
      'd3-format',
      'd3-color',
      'd3-time-format',
      'h3-js',
      'viewport-mercator-project',
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [
        /node_modules[\\/]kepler.gl/,
        /node_modules[\\/]@loaders.gl/,
        /node_modules[\\/]d3-*/
      ],
    },
    rollupOptions: {
      external: ['fs', 'path', 'crypto'],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
      clientPort: 3000,
    },
  },

});