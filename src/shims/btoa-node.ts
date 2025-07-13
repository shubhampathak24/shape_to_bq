// Browser-friendly shim for loaders.gl expectation of Node btoa/atob module
// loaders.gl polyfills import "../text-encoding/btoa.node" which provides atob/btoa in Node.
// In the browser we already have global atob/btoa on window, so just re-export them.

export const atob = (str: string): string => {
  return globalThis.atob ? globalThis.atob(str) : Buffer.from(str, 'base64').toString('binary');
};

export const btoa = (str: string): string => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return globalThis.btoa ? globalThis.btoa(str) : Buffer.from(str, 'binary').toString('base64');
};

export default { atob, btoa };
