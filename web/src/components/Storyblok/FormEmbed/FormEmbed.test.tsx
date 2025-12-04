import { render, screen } from "@testing-library/react";

import { FormEmbedStoryblok } from "@/types/storyblok";

import { FormEmbed } from "./FormEmbed";

const mockFormEmbed: FormEmbedStoryblok = {
	_uid: "341e187273",
	title: "NICE Advice contact us",
	formId: "10000",
	component: "formEmbed",
} as FormEmbedStoryblok;

const mockMissingTitle: FormEmbedStoryblok = {
	_uid: "341e187273",
	title: "",
	formId: "10000",
	component: "formEmbed",
};

const mockMissingFormID: FormEmbedStoryblok = {
	_uid: "341e187273",
	title: "NICE Advice contact us",
	formId: "",
	component: "formEmbed",
};

const mockMissingBothProps: FormEmbedStoryblok = {
	_uid: "341e187273",
	title: "",
	formId: "",
	component: "formEmbed",
};

const mockMissingBothWithEmptyStringsProps: FormEmbedStoryblok = {
	_uid: "341e187273",
	title: "   ",
	formId: "   ",
	component: "formEmbed",
};

describe("FormEmbed", () => {
	it("should render JotFormEmbed through the Storyblok FormEmbed component", () => {
		render(<FormEmbed blok={mockFormEmbed} />);

		expect(screen.getByTitle(mockFormEmbed.title)).toHaveAttribute(
			"src",
			`https://next-web-tests.jotform.com/${mockFormEmbed.formId}?isIframeEmbed=1`
		);
	});

	it("renders a fallback UI message when the title is missing", () => {
		render(<FormEmbed blok={mockMissingTitle} />);
		expect(
			screen.getByText("This form is not available at the moment")
		).toBeInTheDocument();
	});

	it("renders a fallback message when the formID is missing", () => {
		render(<FormEmbed blok={mockMissingFormID} />);
		expect(
			screen.getByText("This form is not available at the moment")
		).toBeInTheDocument();
	});

	it("renders a fallback message when both title and formID are missing", () => {
		render(<FormEmbed blok={mockMissingBothProps} />);
		expect(
			screen.getByText("This form is not available at the moment")
		).toBeInTheDocument();
	});

	it("renders a fallback message when both title and formID are passed as empty strings", () => {
		render(<FormEmbed blok={mockMissingBothWithEmptyStringsProps} />);
		expect(
			screen.getByText("This form is not available at the moment")
		).toBeInTheDocument();
	});
});
