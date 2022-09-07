import { render } from "@testing-library/react";

import { SearchNoResults } from "./SearchNoResults";

describe("SearchNoResults", () => {
	it("should match snapshot", () => {
		render(<SearchNoResults searchText="wxyzyxxxxyxxy" />);

		expect(document.body).toMatchSnapshot();
	});
});
