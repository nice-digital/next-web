/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";

import { mockNewsArticle, mockBlogPost } from "@/test-utils/storyblok-data";

import { Spotlight, type SpotlightProps } from "./Spotlight";

const mockSpotlight: SpotlightProps = {
	blok: {
		heading: "Mock spotlight title",
		mediaDescription: "Mock media description",
		_uid: "123456789",
		component: "spotlight",
		youtubeEmbed: [
			{
				title: "Test Youtube title",
				source: "wwSzpaTHyS8",
				_uid: "123456",
				component: "youtubeEmbed",
			},
		],
		stories: [mockNewsArticle, mockBlogPost],
	},
};

describe("Spotlight component", () => {
	it("should match snapshot", () => {
		const { container } = render(<Spotlight {...mockSpotlight} />);
		expect(container).toMatchSnapshot();
	});

	it("should render a heading at the correct level if one is specified", () => {
		const spotlight: SpotlightProps = {
			...mockSpotlight,
			headingLevel: 5,
		};

		render(<Spotlight {...spotlight} />);
		expect(
			screen.getByRole("heading", { level: 5, name: "Mock spotlight title" })
		).toBeInTheDocument();
	});
});
