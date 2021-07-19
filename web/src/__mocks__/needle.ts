import { NeedleHttpVerbs, NeedleOptions, NeedleResponse } from "needle";

import { serverRuntimeConfig } from "@/config";
import { FeedPath as PublicationsFeedPath } from "@/feeds/publications/publications";
import { FeedPath as InDevFeedPath } from "@/feeds/inDev/inDev";

const mockDataDirectory = "./__data__/";

const { publications, inDev } = serverRuntimeConfig.feeds;

const okResponse = (path: string): NeedleResponse =>
	({
		body: require(mockDataDirectory + path),
		statusCode: 200,
	} as NeedleResponse);

/**
 * Default mock of needle to avoid actually trying to make HTTP calls in tests
 */
const fakeNeedleImplementation = async (
	_method: NeedleHttpVerbs,
	urlStr: string,
	_options: NeedleOptions
): Promise<NeedleResponse> => {
	const url = new URL(urlStr);

	// Publications feeds
	if (url.origin === publications.origin) {
		switch (url.pathname) {
			case PublicationsFeedPath.AreasOfInterest:
			case PublicationsFeedPath.ProductTypes:
			case PublicationsFeedPath.ProductsLite:
				return okResponse(`publications/${url.pathname}.json`);
			default:
				throw new Error(
					`Publications feed ${url.pathname} needs to be mocked: edit file ${__filename} to add a fake implementation for unit testing`
				);
		}
	}

	// InDev feeds
	if (url.origin === inDev.origin) {
		switch (url.pathname) {
			case InDevFeedPath.AllProjects:
			case InDevFeedPath.InConsultationProjects:
				return okResponse(`inDev/${url.pathname}.json`);
			default:
				throw new Error(
					`In Dev feed ${url.pathname} needs to be mocked: edit file ${__filename} to add a fake implementation for unit testing`
				);
		}
	}

	throw new Error(
		`URL ${url} needs to be mocked: edit file ${__filename} to add a fake implementation for unit testing`
	);
};

// Return a mock with an implementation (rather than just an object) which allows tests to add their own mocks
const needle = jest.fn().mockImplementation(fakeNeedleImplementation);

export default needle;
