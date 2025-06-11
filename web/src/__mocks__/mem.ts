// NOTE: Jest does not support ESM-only modules like 'mem' out of the box, so we mock it here as a manual mock (__mocks__ dir) and export as default
// because that is how it is imported where we use it in the application, i.e. import mem from "mem";
// See: https://jestjs.io/docs/ecmascript-modules for more info.

const mem = <T extends (...args: unknown[]) => unknown>(fn: T): T => fn;

export default mem;
