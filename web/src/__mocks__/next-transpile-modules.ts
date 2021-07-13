import { NextConfig } from "next/dist/next-server/server/config";

/**
 * next-transpile-modules tries to look for various modules but because our tests
 * are running in the root it looks in the wrong place.
 * We don't care about them testing so we mock them.
 */
const mockWithTranspiledModules =
	(_modules: []) =>
	(obj: NextConfig): NextConfig =>
		obj;

module.exports = mockWithTranspiledModules;
