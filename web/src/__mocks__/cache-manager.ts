import type { CacheOptions } from "cache-manager";

/**
 * Fake implementation of node-cache-manager to avoid actually trying to access cache in tests
 */
export const caching = jest.fn().mockReturnValue({
	wrap: jest.fn().mockImplementation(
		// Simple implementation that simply returns the action that gets the uncached object:
		// which means no caching at all. If you want caching in your tests, then you'll have to provide your own mock
		async (
			_key: string,
			getUncachedAction: () => Promise<unknown>,
			_options: CacheOptions
		) => getUncachedAction()
	),
});
