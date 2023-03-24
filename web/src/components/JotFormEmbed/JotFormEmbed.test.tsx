import { render, screen } from "@testing-library/react";

import { JotFormEmbed } from "./JotFormEmbed";

describe("JotFormEmbed", () => {
	it("should render iframe with title", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		expect(screen.getByTitle("This is a title")).toHaveProperty(
			"tagName",
			"IFRAME"
		);
	});

	it("should use form id with JotForm base URL in iframe source", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		expect(screen.getByTitle("This is a title")).toHaveAttribute(
			"src",
			"https://nice.jotform.com/1234"
		);
	});

	it("should allow full screen on iframe", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		expect(screen.getByTitle("This is a title")).toHaveAttribute(
			"allowfullscreen",
			""
		);
	});

	it("should allow geolocation, microphone and camera on iframe", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		expect(screen.getByTitle("This is a title")).toHaveAttribute(
			"allow",
			"geolocation; microphone; camera"
		);
	});

	it("should use hidden overflow style", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		expect(screen.getByTitle("This is a title")).toHaveStyle({
			overflow: "hidden",
		});
	});

	it("should use given initial height", () => {
		render(
			<JotFormEmbed jotFormID="1234" title="This is a title" height={999} />
		);

		expect(screen.getByTitle("This is a title")).toHaveStyle({
			height: "999px",
		});
	});

	// it("should use given initial height", () => {
	// 	render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

	// 	window.postMessage("setHeight:987:1234", "*");

	// 	expect(screen.getByTitle("This is a title")).toHaveStyle({
	// 		height: "987px",
	// 	});
	// });
});
