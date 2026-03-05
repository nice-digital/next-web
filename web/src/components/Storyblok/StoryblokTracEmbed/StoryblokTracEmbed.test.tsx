import { render, screen } from "@testing-library/react";

import { TracEmbedStoryblok } from "@/types/storyblok";

import { StoryblokTracEmbed } from "./StoryblokTracEmbed";

const mockTracEmbed: TracEmbedStoryblok = {
	jobBoardsID: "123456",
	integrityKey: "xxxintegritykeyxxx",
	component: "tracEmbed",
	_uid: "",
};

describe("StoryblokTracEmbed", () => {
	it("should render the quote ", () => {
		render(<StoryblokTracEmbed blok={mockTracEmbed} />);
		const container = screen.getByLabelText("Trac Jobs Board");
		expect(container).toBeInTheDocument();
		expect(container).toHaveAttribute("id", "trac-jobs-container");
		expect(container).toHaveAttribute("aria-live", "polite");
	});
	it("should load the Trac embed script with correct attributes", () => {
		render(<StoryblokTracEmbed blok={mockTracEmbed} />);
		const script = screen.getByTestId("trac-feed-script");
		expect(script).toBeInTheDocument();
		expect(script).toHaveAttribute(
			"src",
			"https://feeds.trac.jobs/js/v18/EmbeddedJobsBoard.js"
		);
		expect(script).toHaveAttribute("data-JobsBoardID", "123456");
		expect(script).toHaveAttribute("data-crossorigin", "anonymous");
		expect(script).toHaveAttribute("data-integrity", "xxxintegritykeyxxx");
		expect(script).toHaveAttribute("data-IncludeCSS", "false");
	});
	it("should not load the script multiple times on re-render", () => {
		const { rerender } = render(<StoryblokTracEmbed blok={mockTracEmbed} />);
		const initialScript = screen.getByTestId("trac-feed-script");
		expect(initialScript).toBeInTheDocument();

		rerender(<StoryblokTracEmbed blok={mockTracEmbed} />);
		const scripts = screen.getAllByTestId("trac-feed-script");
		expect(scripts).toHaveLength(1);
	});
});
