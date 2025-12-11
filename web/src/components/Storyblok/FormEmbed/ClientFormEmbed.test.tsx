import { render, screen } from "@testing-library/react";

import { FormEmbedStoryblok } from "@/types/storyblok";

import { ClientFormEmbed } from "./ClientFormEmbed";

const mockFormEmbed: FormEmbedStoryblok = {
	_uid: "341e187273",
	title: "NICE Advice contact us",
	formId: "10000",
	component: "formEmbed",
};

jest.mock("./FormEmbed", () => ({
	FormEmbed: jest.fn(({ blok }) => (
		<div data-testid="mock-form-embed">{blok.formId}</div>
	)),
}));

describe("ClientFormEmbed", () => {
	it("renders loading placeholder initially", () => {
		render(<ClientFormEmbed blok={mockFormEmbed} />);
		expect(screen.getByText("Loading form, please wait")).toBeInTheDocument();
	});

	it("loads and renders InfogramEmbed", async () => {
		render(<ClientFormEmbed blok={mockFormEmbed} />);
		await screen.findByTestId("mock-form-embed");

		expect(screen.getByText(mockFormEmbed.formId)).toBeInTheDocument();
	});
});
