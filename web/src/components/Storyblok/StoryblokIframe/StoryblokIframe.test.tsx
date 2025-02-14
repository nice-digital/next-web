import { render, screen } from "@testing-library/react";
import { createRef } from "react";

import { StoryblokIframe, StoryblokIframeProps } from "./StoryblokIframe";

const mockIframeBlok: StoryblokIframeProps = {
	blok: {
		_uid: "123",
		component: "iframe",
		title: "Test Title",
		source: "https://test.com",
	},
};

describe("StoryblokIframe", () => {
	it("renders without crashing", () => {
		render(<StoryblokIframe blok={mockIframeBlok.blok} />);
		expect(screen.getByTitle("Test Title")).toBeInTheDocument();
	});

	it("passes additional props to the iframe", () => {
		render(<StoryblokIframe blok={mockIframeBlok.blok} data-testid="iframe" />);
		expect(screen.getByTestId("iframe")).toBeInTheDocument();
	});

	it("sets the correct source for the iframe", () => {
		render(<StoryblokIframe blok={mockIframeBlok.blok} />);
		expect(screen.getByTitle("Test Title")).toHaveAttribute(
			"src",
			"https://test.com"
		);
	});

	it("forwards the ref to the iframe", () => {
		const ref = createRef<HTMLIFrameElement>();
		render(<StoryblokIframe blok={mockIframeBlok.blok} ref={ref} />);
		expect(ref.current).toBe(screen.getByTitle("Test Title"));
	});

	it("can be styled with a className", () => {
		render(
			<StoryblokIframe blok={mockIframeBlok.blok} className="test-class" />
		);
		expect(screen.getByTitle("Test Title")).toHaveClass("test-class");
	});

	it("can take relevant iframe attributes", () => {
		render(
			<StoryblokIframe
				blok={mockIframeBlok.blok}
				width="100%"
				height="100px"
				loading="eager"
			/>
		);
		expect(screen.getByTitle("Test Title")).toHaveAttribute("width", "100%");
		expect(screen.getByTitle("Test Title")).toHaveAttribute("height", "100px");
		expect(screen.getByTitle("Test Title")).toHaveAttribute("loading", "eager");
	});
});
