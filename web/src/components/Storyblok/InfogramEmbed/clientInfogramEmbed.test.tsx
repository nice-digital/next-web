import { render, screen, waitFor } from "@testing-library/react";
import { ClientInfogramEmbed } from "./ClientInfogramEmbed";
import { InfogramEmbedStoryblok } from "@/types/storyblok";

const mockBlok:InfogramEmbedStoryblok = {
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
		await waitFor(() =>
			expect(screen.getByTestId("mock-infogram")).toBeInTheDocument()
		);

		expect(screen.getByText(mockBlok.infogramUrl)).toBeInTheDocument();
	});
});
