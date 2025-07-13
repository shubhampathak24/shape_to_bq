// Browser shim for loaders.gl ReadableStreamPolyfill
export const ReadableStreamPolyfill = globalThis.ReadableStream || class {};
export default { ReadableStreamPolyfill };
