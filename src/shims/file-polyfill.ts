// Browser shim for loaders.gl FilePolyfill
export const FilePolyfill = globalThis.File || class {};
export default { FilePolyfill };
