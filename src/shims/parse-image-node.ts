// Browser shim for @loaders.gl/polyfills parseImageNode
export const parseImageNode = () => {
  throw new Error('parseImageNode is not available in the browser');
};
export default { parseImageNode };
