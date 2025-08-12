import { render, screen } from "@testing-library/react";

import { OnThisPageBasic, type OnThisPageBasicProps } from "./OnThisPageBasic";

describe("OnThisPageBasic", () => {
	const props: OnThisPageBasicProps = {
		sections: [
			{
				slug: "test-1",
				title: "Test 1",
			},
			{
				slug: "test-2",
				title: "Test 2",
			},
		],
	};

	it("should render nothing when there is only 1 section", () => {
		render(<OnThisPageBasic sections={[props.sections[0]]} />);

		expect(screen.queryByRole("navigation")).toBeNull();
	});

	it("should render labelled navigation wrapper", () => {
		render(<OnThisPageBasic {...props} />);

		expect(
			screen.getByRole("navigation", { name: "On this page" })
		).toBeInTheDocument();
	});

	it("should render a heading", () => {
		render(<OnThisPageBasic {...props} />);

		expect(
			screen.getByRole("heading", { name: "On this page" })
		).toBeInTheDocument();
	});

	it("should render a list of items", () => {
		render(<OnThisPageBasic {...props} />);
		expect(screen.getByRole("list")).toBeInTheDocument();
	});

	it("should render an anchor for each section", () => {
		render(<OnThisPageBasic {...props} />);
		expect(screen.getAllByRole("link")).toHaveLength(props.sections.length);
	});

	it.todo("should highlight the currently visible section");
});
