import React from "react";
import { render, screen } from "@testing-library/react";
import { StoryblokImageRichText } from "./StoryblokImageRichText";

const blok = {
    image: {
        filename: "https://a.storyblok.com/f/292509/805x603/292d0d5de8/nhs-team.JPG",
        alt: "Desktop Image",
        fieldtype: "asset" as "asset",
        id: 1,
        name: "nhs-team.JPG",
        title: "Desktop Image",
        focus: null,
    },
    content: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Hello World" }] }] },
    imageSize: "medium" as "medium",
    imagePosition: "left" as "left",
    hideImage: false,
    smallScreenImage: {
        filename: "https://a.storyblok.com/f/292509/805x603/292d0d5de8/nhs-team.JPG",
        alt: "Mobile Image",
        fieldtype: "asset" as "asset",
        id: 2,
        name: "nhs-team.JPG",
        title: "Mobile Image",
        focus: null,
    },
    _uid: "123",
    component: "imageRichText" as "imageRichText",
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
        const blokWithHide = { ...blok, hideImage: true };
        const { container } = render(<StoryblokImageRichText blok={blokWithHide} />);
        const gridItems = container.querySelectorAll('[data-component="grid-item"]');
        expect(gridItems.length).toBeGreaterThan(0);

        const hiddenGridItem = Array.from(gridItems).find(item =>
            item.className.includes('hideImageOnMobile')
        );
        expect(hiddenGridItem).toBeDefined();

        expect(hiddenGridItem?.querySelector('img[alt="Desktop Image"]')).toBeInTheDocument();
        expect(hiddenGridItem?.querySelector('img[alt="Mobile Image"]')).toBeInTheDocument();
        expect(hiddenGridItem?.className).toContain('hideImageOnMobile');
    });
    it("renders only desktop image if smallScreenImage is not provided", () => {
        const blokNoMobile = { ...blok, smallScreenImage: undefined };
        render(<StoryblokImageRichText blok={blokNoMobile} />);
        expect(screen.getByAltText("Desktop Image")).toBeInTheDocument();
        expect(screen.queryByAltText("Mobile Image")).not.toBeInTheDocument();
    });

    it("renders image on the right if imagePosition is right", () => {
        const blokRight = { ...blok, imagePosition: "right" as "right" };
        const { container } = render(<StoryblokImageRichText blok={blokRight} />);
        const gridItems = container.querySelectorAll('[data-component="grid-item"]');
        expect(gridItems.length).toBeGreaterThan(1);
        expect(gridItems[1]?.querySelector('img[alt="Desktop Image"]')).toBeInTheDocument();
    });
});
