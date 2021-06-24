import React from "react";

import { screen, render } from "@testing-library/react";
import Home from "./index.page";

describe("Homepage", () => {
	it("a sample test", async () => {
		render(<Home />);
		expect(screen.getByText("Documentation", { exact: false }).tagName).toBe(
			"H2"
		);
	});
});
