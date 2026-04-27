import { render, screen, fireEvent } from "@testing-library/react";

import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import { TracEmbedStoryblok } from "@/types/storyblok";

import { StoryblokTracEmbed } from "./StoryblokTracEmbed";

jest.mock("@/logger", () => ({
	logger: { error: jest.fn(), info: jest.fn() },
}));

type Writable<T> = {
	-readonly [K in keyof T]: Writable<T[K]>;
};

const mockTracEmbed: TracEmbedStoryblok = {
	jobBoardID: "123456",
	component: "tracEmbed",
	_uid: "",
};

jest.mock("@/config", () => ({
	publicRuntimeConfig: {
		trac: {
			version: "v18",
			integrityKey: "integrityKey123",
		},
	},
}));

describe("StoryblokTracEmbed", () => {
	beforeEach(() => {
		window.dataLayer = { push: jest.fn() } as unknown as DataLayerEntry[];
	});

	afterEach(() => {
		jest.resetAllMocks();
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
		expect(script).toHaveAttribute("crossorigin", "anonymous");
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

	it("should return unable to load message if version undefined", () => {
		const config = publicRuntimeConfig as Writable<typeof publicRuntimeConfig>;
		config.trac.version = undefined as unknown as string;

		render(<StoryblokTracEmbed blok={mockTracEmbed} />);

		expect(
			screen.getByText("We are unable to load job listings at the moment.")
		).toBeInTheDocument();
	});

	it("should return unable to load message if integrity key undefined", () => {
		const config = publicRuntimeConfig as Writable<typeof publicRuntimeConfig>;
		config.trac.integrityKey = undefined as unknown as string;

		render(<StoryblokTracEmbed blok={mockTracEmbed} />);

		expect(
			screen.getByText("We are unable to load job listings at the moment.")
		).toBeInTheDocument();
	});

	it("should log error if trac integrity key undefined", () => {
		const config = publicRuntimeConfig as Writable<typeof publicRuntimeConfig>;
		config.trac.integrityKey = undefined as unknown as string;

		render(<StoryblokTracEmbed blok={mockTracEmbed} />);

		expect(logger.error as jest.Mock).toHaveBeenCalled();
		expect(logger.error).toHaveBeenCalledWith(
			expect.objectContaining({
				integrityKey: false,
			}),
			"TRAC embed configuration invalid or missing"
		);
	});

	it("should log error if trac version undefined", () => {
		const config = publicRuntimeConfig as Writable<typeof publicRuntimeConfig>;
		config.trac.version = undefined as unknown as string;
		config.trac.integrityKey = undefined as unknown as string;

		render(<StoryblokTracEmbed blok={mockTracEmbed} />);

		expect(logger.error as jest.Mock).toHaveBeenCalled();
		expect(logger.error).toHaveBeenCalledWith(
			expect.objectContaining({
				version: undefined,
			}),
			"TRAC embed configuration invalid or missing"
		);
	});
});
