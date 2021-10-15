import mockDate from "mockdate";
import { useRouter } from "next/router";

import { SearchResultsSuccess, SearchUrl } from "@nice-digital/search-client";

import { render } from "@/test-utils";

import sampleData from "../../../__mocks__/__data__/search/guidance-inconsultation.json";
import InConsultationPage from "../inconsultation.page";

(useRouter as jest.Mock).mockImplementation(() => ({
	route: "/",
	pathname: "",
	query: "",
	asPath: "",
	push: jest.fn(),
}));

describe("/guidance/inconsultation", () => {
	it("should match the snapshot", () => {
		mockDate.set("2020-11-22");

		expect(
			render(
				<InConsultationPage
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
					searchUrl={{ route: "/guidance/inconsultation" } as SearchUrl}
				/>
			).container
		).toMatchSnapshot();
	});
});
