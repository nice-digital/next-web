import "@testing-library/jest-dom";

import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

//import * as matchers from "jest-extended/all";
//expect.extend(matchers);

expect.extend({
	toHaveTextContentIgnoreTags(received, expected) {
		const strippedReceived = received.replace(/(<([^>]+)>)/gi, "");
		const strippedExpected = expected.replace(/(<([^>]+)>)/gi, "");
		const pass = strippedReceived.includes(strippedExpected);
		if (pass) {
			return {
				message: () =>
					`expected ${received} not to have text content ignoring tags ${expected}`,
				pass: true,
			};
		} else {
			return {
				message: () =>
					`expected ${received} to have text content ignoring tags ${expected}`,
				pass: false,
			};
		}
	},
});

jest.mock("@storyblok/react", () => ({
	...jest.requireActual("@storyblok/react"),
	getStoryblokApi: jest.fn().mockReturnValue({
		get: jest.fn(),
		getAll: jest.fn(),
	}),
	storyblokInit: jest.fn(),
	apiPlugin: {},
}));

beforeEach(() => {
	axiosJSONMock.reset();
	addDefaultJSONFeedMocks();
});

// We run some tests (e.g. caching/feed logic) with a node environment (rather than JSDOM) so window isn't always available
if (typeof window !== "undefined") {
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
}
