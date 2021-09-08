import { SearchResultsSuccess } from "@nice-digital/search-client/types";

import { render, screen } from "@/test-utils";

import { Published } from "./published.page";
import sampleData from "./published.sample.json";

jest.mock("next/router", () => ({
	useRouter() {
		return {
			route: "/",
			pathname: "",
			query: "",
			asPath: "",
		};
	},
}));

describe("/guidance/published", () => {
	describe("Table", () => {
		it.only("should have some sort of test", () => {
			render(
				<Published
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
				/>
			);
			screen.getByText("Title");
		});
	});
});
