import mockDate from "mockdate";
import { useRouter } from "next/router";

import { SearchResultsSuccess, SearchUrl } from "@nice-digital/search-client";

import sampleData from "@/mockData/search/guidance-terminated.json";
import { render } from "@/test-utils/rendering";

import TerminatedPage from "../terminated.page";

(useRouter as jest.Mock).mockImplementation(() => ({
	route: "/",
	pathname: "",
	query: "",
	asPath: "",
	push: jest.fn(),
}));

describe("/guidance/terminated", () => {
	it("should match the snapshot", () => {
		mockDate.set("2020-11-22");

		expect(
			render(
				<TerminatedPage
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
					searchUrl={{ route: "/guidance/terminated" } as SearchUrl}
				/>
			).container
		).toMatchSnapshot();
	});
});
