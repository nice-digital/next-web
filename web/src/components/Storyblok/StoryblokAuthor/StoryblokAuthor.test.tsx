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
		filename:
			"https://local-host-test-nice-org.com/f/292509/2120x1414/dd56873afd/joe-bloggs.jpg",
		alt: "Joe Bloggs",
		fieldtype: "asset",
		title: null,
		focus: null,
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
		expect(imageSrc).toContain(
			"/_next/image?url=https%3A%2F%2Flocal-host-test-nice-org.com%2Ff%2F292509%2F2120x1414%2Fdd56873afd%2Fjoe-bloggs.jpg%2Fm%2F270x270%2Fsmart%2Ffilters%3Aformat%2528jpeg%2529%3Aquality%252880%2529&w=640&q=75"
		);
	});

	it("should not render an image if no image is provided", () => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { image, ...blokContentWithoutImage } = blokContent;

		render(<StoryblokAuthor blok={blokContentWithoutImage} />);

		const authImage = screen.queryByAltText("test alt");
		expect(authImage).not.toBeInTheDocument();
	});
});
