import { render, screen } from "@testing-library/react";
import { ScriptProps } from "next/script";

import { InfogramEmbedStoryblok } from "@/types/storyblok";

import { StoryblokInfogramEmbed } from "./StoryblokInfogramEmbed";

// Mock next/script to simulate loading
jest.mock("next/script", () => (props: ScriptProps) => {
	props.onLoad?.({} as Parameters<NonNullable<ScriptProps["onLoad"]>>[0]);
	return <div data-testid="mock-script" />;
});

const infogramId = "ta-cancer-decisions-by-type-1hxj48nzk5x54vg";
const validUrl = `https://infogram.com/${infogramId}`;

const baseProps: InfogramEmbedStoryblok = {
	infogramUrl: validUrl,
	layoutVariant: "constrained",
	displayMode: "standalone",
	component: "infogramEmbed",
	_uid: "mock-uid-1",
	content: { type: "doc", content: [] },
};

describe("StoryblokInfogramEmbed", () => {
	beforeEach(() => {
		// Cleanup and mock global object
		screen.queryByTestId("mock-script")?.remove();
		window.infogramEmbed = { load: jest.fn() };
	});

	it("renders standalone mode with valid URL", () => {
		render(<StoryblokInfogramEmbed blok={baseProps} />);
		const embed = screen.getByTestId(infogramId);
		expect(embed).toBeInTheDocument();
		expect(embed).toHaveAttribute("data-id", infogramId);
		expect(embed).toHaveAttribute("data-mode-type", "standalone");
		expect(embed).toHaveAttribute("data-type", "interactive");
	});

	it("renders with rich text mode and fallback content", () => {
		render(
			<StoryblokInfogramEmbed
				blok={{
					...baseProps,
					displayMode: "withRichText",
					content: {
						type: "doc",
						content: [
							{
								type: "text",
								text: "Default Content Value",
							},
						],
					},
				}}
			/>
		);
		expect(screen.getByTestId("infogram-richtext")).toBeInTheDocument();
		expect(screen.getByText("Default Content Value")).toBeInTheDocument();
		expect(screen.getByTestId(infogramId)).toBeInTheDocument();
	});

	it("renders with full width layoutVariant", () => {
		render(
			<StoryblokInfogramEmbed
				blok={{
					...baseProps,
					layoutVariant: "fullwidth",
				}}
			/>
		);
		const embed = screen.getByTestId(infogramId);
		expect(embed.className).toContain("infogram-embed");
		expect(embed.className).not.toContain("infogramEmbed--constrained");
	});

	it("shows error if URL is missing", () => {
		render(
			<StoryblokInfogramEmbed
				blok={{
					...baseProps,
					infogramUrl: "",
				}}
			/>
		);
		expect(
			screen.getByText(/Invalid or missing Infogram URL/i)
		).toBeInTheDocument();
	});

	it("does not re-inject script if already in DOM", () => {
		const script = document.createElement("script");
		script.id = "infogram-async";
		document.body.appendChild(script);

		render(<StoryblokInfogramEmbed blok={baseProps} />);
		expect(screen.queryByTestId("mock-script")).not.toBeInTheDocument();
	});

	it("calls infogramEmbedNew.load if script already exists", () => {
		const script = document.createElement("script");
		script.id = "infogram-async";
		document.body.appendChild(script);

		render(<StoryblokInfogramEmbed blok={baseProps} />);
		expect(window.infogramEmbed?.load).toHaveBeenCalled();
	});
});
