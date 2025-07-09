import { render, screen } from "@testing-library/react";

import { InfogramEmbedStoryblok } from "@/types/storyblok";

import { ClientInfogramEmbed } from "./ClientInfogramEmbed";

const mockBlok: InfogramEmbedStoryblok = {
	infogramUrl: "https://infogram.com/sample-id",
	infogramVariant: "interactive",
	layoutVariant: "default",
	component: "infogramEmbed",
	_uid: "test-uid-1",
};

jest.mock("./InfogramEmbed", () => ({
	InfogramEmbed: jest.fn(({ blok }) => (
		<div data-testid="mock-infogram">{blok.infogramUrl}</div>
	)),
}));

describe("ClientInfogramEmbed", () => {
	it("renders loading placeholder initially", () => {
		render(<ClientInfogramEmbed blok={mockBlok} />);
		expect(screen.getByText("Loading Infogram...")).toBeInTheDocument();
	});

	it("loads and renders InfogramEmbed", async () => {
		render(<ClientInfogramEmbed blok={mockBlok} />);
		await screen.findByTestId("mock-infogram");

		expect(screen.getByText(mockBlok.infogramUrl)).toBeInTheDocument();
	});
});
