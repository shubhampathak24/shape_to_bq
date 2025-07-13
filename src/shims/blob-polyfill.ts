// Browser shim for loaders.gl BlobPolyfill
export const BlobPolyfill = globalThis.Blob || class {};
export default { BlobPolyfill };
