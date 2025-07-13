// Browser shim for @loaders.gl/polyfills encodeImageNode
export const encodeImageNode = () => {
  throw new Error('encodeImageNode is not available in the browser');
};
export default { encodeImageNode };
