import "@testing-library/jest-dom";

import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";
//import * as matchers from "jest-extended/all";

//expect.extend(matchers);

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
