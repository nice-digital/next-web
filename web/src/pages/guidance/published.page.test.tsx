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
		it("should have some sort of test", () => {
			render(
				<Published
					activeModifiers={[]}
					results={sampleData as unknown as SearchResultsSuccess}
				/>
			);
			expect(screen.getByText("Title", { selector: "th" })).toBeInTheDocument();
			expect(
				screen.getByText("Reference Number", { selector: "th" })
			).toBeInTheDocument();
			expect(
				screen.getByText("Published", { selector: "th" })
			).toBeInTheDocument();
			expect(
				screen.getByText("Last updated", { selector: "th" })
			).toBeInTheDocument();
		});
	});
});
