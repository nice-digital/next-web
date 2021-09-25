import mockPublishedJsonResponse from "../__data__/search/guidance-published.json";

const searchClient = jest.requireActual("@nice-digital/search-client");

module.exports = {
	...searchClient,
	search: jest.fn().mockResolvedValue(mockPublishedJsonResponse),
};
