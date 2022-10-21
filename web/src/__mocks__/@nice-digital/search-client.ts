import mockPublishedJsonResponse from "@/mockData/search/guidance-published.json";

const searchClient = jest.requireActual("@nice-digital/search-client");

module.exports = {
	...searchClient,
	search: jest.fn().mockResolvedValue(mockPublishedJsonResponse),
};
