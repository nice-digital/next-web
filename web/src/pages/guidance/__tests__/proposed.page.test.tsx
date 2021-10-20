import mockDate from "mockdate";
import { useRouter } from "next/router";

import { SearchResultsSuccess, SearchUrl } from "@nice-digital/search-client";

import { render } from "@/test-utils";

import sampleData from "../../../__mocks__/__data__/search/guidance-proposed.json";
import ProposedPage from "../proposed.page";

(useRouter as jest.Mock).mockImplementation(() => ({
	route: "/",
	pathname: "",
	query: "",
	asPath: "",
	push: jest.fn(),
}));

describe("/guidance/proposed", () => {
	it("should match the snapshot", () => {
		mockDate.set("2020-11-22");

		expect(
			render(
				<ProposedPage
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
					searchUrl={{ route: "/guidance/proposed" } as SearchUrl}
				/>
			).container
		).toMatchSnapshot();
	});
});
