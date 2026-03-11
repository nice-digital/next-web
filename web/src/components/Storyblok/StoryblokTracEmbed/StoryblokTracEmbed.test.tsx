import { render, screen, fireEvent } from "@testing-library/react";

import { TracEmbedStoryblok } from "@/types/storyblok";

import { StoryblokTracEmbed } from "./StoryblokTracEmbed";

const mockTracEmbed: TracEmbedStoryblok = {
	jobBoardsID: "123456",
	component: "tracEmbed",
	_uid: "",
};

describe("StoryblokTracEmbed", () => {
	const ORIGINAL_ENV = process.env;

	beforeEach(() => {
		window.dataLayer = { push: jest.fn() } as unknown as DataLayerEntry[];
		process.env = { ...ORIGINAL_ENV };
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	afterAll(() => {
		process.env = ORIGINAL_ENV;
	});

	it("should render Trac Embed div", () => {
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
		expect(script).toHaveAttribute("data-JobsBoardID", "123456");
		expect(script).toHaveAttribute("data-crossorigin", "anonymous");
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

	it("should push a tracjobs-hashchange event to dataLayer when the hash changes", () => {
		const dataLayerPush = jest.spyOn(window.dataLayer, "push");

		render(<StoryblokTracEmbed blok={mockTracEmbed} />);

		window.location.hash = "#job_123";
		fireEvent(window, new HashChangeEvent("hashchange"));

		expect(dataLayerPush).toHaveBeenCalledWith({
			event: "tracjobs-hashchange",
			hash: "#job_123",
			url: window.location.href,
		});
	});
	it("should remove event listener on unmount", () => {
		const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
		const { unmount } = render(<StoryblokTracEmbed blok={mockTracEmbed} />);

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			"hashchange",
			expect.any(Function)
		);
	});
	it("should return invalid trac configuration message if the version undefined", () => {
		const originalEnv = process.env;

		process.env = { ...originalEnv };
		delete process.env.TRAC_VERSION;
		delete process.env.TRAC_INTEGRITY_KEY;

		render(<StoryblokTracEmbed blok={mockTracEmbed} />);

		expect(screen.getByText("Invalid trac configuration")).toBeInTheDocument();

		process.env = originalEnv;
	});
});
