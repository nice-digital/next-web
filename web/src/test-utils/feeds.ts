import fs from "fs/promises";
import path from "path";

import MockAdapter from "axios-mock-adapter";

import { client } from "../feeds";

const mockDataBaseDirectory = path.resolve(
		__dirname,
		"../",
		"__mocks__",
		"__data__"
	),
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	publicationsBaseUrl = new URL(process.env.SERVER_FEEDS_PUBLICATIONS_ORIGIN!),
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	inDevBaseUrl = new URL(process.env.SERVER_FEEDS_INDEV_ORIGIN!);

export const axiosJSONMock = new MockAdapter(client, {
	onNoMatch: "throwException",
});

/**
 * Adds default JSON endpoint mocks for publications and indev feeds.
 *
 * Maps the incoming request URL to static JSON files on the file system in the mock data folder
 */
export const addDefaultJSONFeedMocks = (): MockAdapter =>
	axiosJSONMock.onGet().reply(async (config) => {
		if (!config.url) throw Error(`URL was empty in Axios mock`);

		const { host, pathname } = new URL(config.url),
			isHTML = config.headers?.Accept === "text/html";

		let filePath = mockDataBaseDirectory;

		if (host === publicationsBaseUrl.host) {
			filePath = path.join(filePath, "publications");
		} else if (host === inDevBaseUrl.host) {
			filePath = path.join(filePath, "inDev");
		} else
			throw Error(
				`Unknown URL host for mocking. Expected either ${publicationsBaseUrl.host} or ${inDevBaseUrl.host} but got ${host}`
			);

		filePath = path.join(
			filePath,
			pathname.toLowerCase() + (isHTML ? ".html" : ".json")
		);

		try {
			await fs.access(filePath);
		} catch {
			throw Error(`Could not find mock JSON file with path ${filePath}`);
		}

		const fileContents = await fs.readFile(filePath, "utf8");

		return [
			200,
			isHTML ? fileContents : !fileContents ? "" : JSON.parse(fileContents),
		];
	});
