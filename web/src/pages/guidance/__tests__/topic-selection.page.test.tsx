import mockDate from "mockdate";
import { useRouter } from "next/router";

import { SearchResultsSuccess, SearchUrl } from "@nice-digital/search-client";

import { render } from "@/test-utils";

import sampleData from "../../../__mocks__/__data__/search/guidance-topic-selection.json";
import TopicSelectionPage from "../topic-selection.page";

(useRouter as jest.Mock).mockImplementation(() => ({
	route: "/",
	pathname: "",
	query: "",
	asPath: "",
	push: jest.fn(),
}));

describe("/guidance/topic-selection", () => {
	it("should match the snapshot", () => {
		mockDate.set("2020-11-22");

		expect(
			render(
				<TopicSelectionPage
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
					searchUrl={{ route: "/guidance/topic-selection" } as SearchUrl}
				/>
			).container
		).toMatchSnapshot();
	});
});
