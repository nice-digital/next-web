import "@testing-library/jest-dom/extend-expect";
import "jest-extended";
import { renderToString } from "react-dom/server";
import { NextConfig } from "next/dist/next-server/server/config";
import nextConfig from "./next.config";

// next-transpile-modules tries to look for various modules but because our tests are running in the root it looks in the wrong place.
// We don't care about them testing so we mock them. The weird 4 arrows below is a factory that returns the mock
jest.mock("next-transpile-modules", () => () => (obj: NextConfig) => obj);

// Next runtime config doesn't work unless NextJS is initialised
// See https://github.com/vercel/next.js/issues/6187#issuecomment-467134205
jest.mock("next/config", () => () => ({
	publicRuntimeConfig: nextConfig.publicRuntimeConfig,
	serverRuntimeConfig: nextConfig.serverRuntimeConfig,
}));

// Mocking next/head allows us to use it in our tests to assert against meta tags/titles
// See https://edibleco.de/3dyJuUl
jest.mock("next/head", () => {
	return {
		__esModule: true,
		default: ({
			children,
		}: {
			children: Parameters<typeof renderToString>[0];
		}) => {
			if (children) {
				global.document.head.insertAdjacentHTML(
					"afterbegin",
					renderToString(children) || ""
				);
			}
			return null;
		},
	};
});

// Default mock of needle to avoid actually trying to make HTTP calls in tests
jest.mock("needle", () =>
	jest
		.fn()
		.mockRejectedValue("Please provide a mock of needle for testing purposes")
);

window.dataLayer = [];
const originalPush = window.dataLayer.push;

window.dataLayer.push = jest.fn<number, DataLayerEntry[]>(
	(dataLayerEntry: DataLayerEntry): number => {
		// Mimick the eventCallback function being called as it would do in a browser
		// with GTM loaded.
		if (dataLayerEntry.eventCallback)
			setTimeout(dataLayerEntry.eventCallback, 100);
		return originalPush.call(window.dataLayer, dataLayerEntry);
	}
);

afterEach(() => {
	// Remove any items from the GTM dataLayer
	window.dataLayer.length = 0;

	// Make sure head is cleaned up after each test: https://edibleco.de/36dKDfL
	// eslint-disable-next-line testing-library/no-node-access
	while (document.head.lastChild)
		// eslint-disable-next-line testing-library/no-node-access
		document.head.removeChild(document.head.lastChild);
});
