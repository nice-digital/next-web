import { render, screen } from "@testing-library/react";

import { FormEmbedStoryblok } from "@/types/storyblok";

import { FormEmbed } from "./FormEmbed";

const mockFormEmbed: FormEmbedStoryblok = {
	_uid: "341e187273",
	title: "NICE Advice contact us",
	formId: "10000",
	component: "formEmbed",
} as FormEmbedStoryblok;

describe("FormEmbed", () => {
	it("should render JotFormEmbed through the Storyblok FormEmbed component", () => {
		render(<FormEmbed blok={mockFormEmbed} />);

		expect(screen.getByTitle(mockFormEmbed.title)).toHaveAttribute(
			"src",
			`https://next-web-tests.jotform.com/${mockFormEmbed.formId}?isIframeEmbed=1`
		);
	});
});
