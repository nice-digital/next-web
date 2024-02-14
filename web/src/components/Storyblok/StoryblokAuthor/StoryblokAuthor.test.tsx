import { render, screen } from "@testing-library/react";

import { AuthorStoryblok } from "@/types/storyblok";

import { StoryblokAuthor } from "./StoryblokAuthor";

const blokContent: AuthorStoryblok = {
	name: "test name",
	_uid: "testuid",
	component: "author",
	image: {
		id: 1,
		name: "test image",
		filename: "test.jpg",
		alt: "test alt",
	},
	jobTitle: "test job title",
};

describe("StoryblokAuthor", () => {
	it("should render the author component", () => {
		render(<StoryblokAuthor blok={blokContent} />);
		expect(screen.getByText("test name")).toBeInTheDocument();
		expect(screen.getByText("test job title")).toBeInTheDocument();
		const imageSrc = screen.getByRole("img").getAttribute("src");

		expect(imageSrc).toContain(".jpg");
		expect(imageSrc).toContain(blokContent.image?.filename);
	});

	it("should not render an image if no image is provided", () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { image, ...blokContentWithoutImage } = blokContent;

		render(<StoryblokAuthor blok={blokContentWithoutImage} />);

		const authImage = screen.queryByAltText("test alt");
		expect(authImage).not.toBeInTheDocument();
	});
});
