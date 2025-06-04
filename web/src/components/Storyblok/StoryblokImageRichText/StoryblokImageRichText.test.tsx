import { render, screen, within } from "@testing-library/react";
import React from "react";

import { StoryblokImageRichText } from "./StoryblokImageRichText";

const blok = {
	mainImage: {
		filename: "https://a.storyblok.com/nhs-team.JPG",
		alt: "Desktop Image",
		fieldtype: "asset" as const,
		id: 1,
		name: "nhs-team.JPG",
		title: "Desktop Image",
		focus: null,
	},
	content: {
		type: "doc",
		content: [
			{ type: "paragraph", content: [{ type: "text", text: "Hello World" }] },
		],
	},
	imageSize: "medium" as const,
	imagePosition: "left" as const,
	hideImagesOnSmallScreens: "false" as "false" | "true",
	smallScreenImage: {
		filename: "https://a.storyblok.com/nhs-team.JPG",
		alt: "Mobile Image",
		fieldtype: "asset" as const,
		id: 2,
		name: "nhs-team.JPG",
		title: "Mobile Image",
		focus: null,
	},
	_uid: "123",
	component: "imageRichText" as const,
};

describe("StoryblokImageRichText", () => {
	it("renders desktop image and text", () => {
		render(<StoryblokImageRichText blok={blok} />);
		expect(screen.getByAltText("Desktop Image")).toBeInTheDocument();
		expect(screen.getByText("Hello World")).toBeInTheDocument();
	});
	it("renders mobile image if smallScreenImage is provided", () => {
		render(<StoryblokImageRichText blok={blok} />);
		expect(screen.getByAltText("Mobile Image")).toBeInTheDocument();
	});

	it("hides both images when hideImage is true (GridItem has hideImageOnMobile class)", () => {
		const blokWithHide = {
			...blok,
			hideImagesOnSmallScreens: "true" as "false" | "true",
		};
		render(<StoryblokImageRichText blok={blokWithHide} />);

		const gridItems = screen.getAllByTestId("image-richtext-grid-item");
		expect(gridItems.length).toBeGreaterThan(0);
		const hiddenGridItem = gridItems.find((item) =>
			item.className.includes("hideImageOnMobile")
		);
		expect(hiddenGridItem).toBeDefined();

		expect(screen.getByAltText("Desktop Image")).toBeInTheDocument();
		expect(screen.getByAltText("Mobile Image")).toBeInTheDocument();
		expect(hiddenGridItem?.className).toContain("hideImageOnMobile");
	});
	it("renders only desktop image if smallScreenImage is not provided", () => {
		const blokNoMobile = { ...blok, smallScreenImage: undefined };
		render(<StoryblokImageRichText blok={blokNoMobile} />);
		expect(screen.getByAltText("Desktop Image")).toBeInTheDocument();
		expect(screen.queryByAltText("Mobile Image")).not.toBeInTheDocument();
	});

	it("renders image on the right if imagePosition is right", () => {
		const blokRight = { ...blok, imagePosition: "right" as const };
		render(<StoryblokImageRichText blok={blokRight} />);
		const gridItems = screen.getAllByTestId("image-richtext-grid-item");
		expect(gridItems.length).toBeGreaterThan(1);
		const secondGridItem = gridItems[1];
		const desktopImg = within(secondGridItem).getByAltText("Desktop Image");
		const mobileImg = within(secondGridItem).getByAltText("Mobile Image");

		expect(desktopImg).toHaveClass("imageRichText__desktopOnly");
		expect(mobileImg).toHaveClass("imageRichText__mobileOnly");
	});
});
