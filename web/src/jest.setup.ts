import "@testing-library/jest-dom";
import { createElement } from "react";

import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

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

jest.mock("@/logger", () => ({
	logger: {
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
	},
	useLogger: jest.fn(() => ({
		error: jest.fn(),
	})),
}));

type MockBlok = {
	component: string;
	title?: string;
};

//NOTE we use react.createElement to avoid putting jsx in jest.setup.ts - this would need a change of file extension and extra jest.config and tsconfig changes to make it work

jest.mock("@storyblok/react", () => ({
	...jest.requireActual("@storyblok/react"),
	__esModule: true,
	StoryblokComponent: jest.fn(({ blok }: { blok: MockBlok }) =>
		createElement(
			"div",
			{ "data-testid": `storyblok-component-${blok.component}` },
			blok.component,
			blok.title
		)
	),
	getStoryblokApi: jest.fn().mockReturnValue({
		get: jest.fn(),
		getAll: jest.fn(),
	}),
	storyblokInit: jest.fn(),
	apiPlugin: {},
}));

// mock the useId hook to always return the same value
jest.mock("react", () => ({
	...jest.requireActual("react"),
	useId: () => "r:id",
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
