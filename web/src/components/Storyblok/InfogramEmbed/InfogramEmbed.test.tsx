import { render, screen } from "@testing-library/react";
import { ScriptProps } from "next/script";

import { InfogramEmbedStoryblok } from "@/types/storyblok";

import { InfogramEmbed } from "./InfogramEmbed";

// Mock next/script to simulate script loading
jest.mock("next/script", () => (props: ScriptProps) => {
	props.onLoad?.({} as Parameters<NonNullable<ScriptProps["onLoad"]>>[0]); // simulate the script onLoad event with a dummy event object to overide the type error
	return <div data-testid="mock-script" />;
});

const mockInfogramProps: InfogramEmbedStoryblok = {
	infogramUrl:
		"https://infogram.com/ta-cancer-decisions-by-type-1hxj48nzk5x54vg",
	layoutVariant: "constrained",
	component: "infogramEmbed",
	_uid: "mock-uid-1",
};
describe("InfogramEmbed", () => {
	const validUrl =
		"https://infogram.com/ta-cancer-decisions-by-type-1hxj48nzk5x54vg";
	const infogramId = "ta-cancer-decisions-by-type-1hxj48nzk5x54vg";

	beforeEach(() => {
		// Cleanup and reset global object before each test
		const script = screen.queryByTestId("infogram-async");
		if (script) script.remove();
		// document.getElementById("infogram-async")?.remove();
		window.infogramEmbeds = {
			load: jest.fn(),
		};
	});

	it("renders with valid URL and default variants", () => {
		render(<InfogramEmbed blok={mockInfogramProps} />);
		const embed = screen.getByTestId(infogramId);
		expect(embed).toBeInTheDocument();
		expect(embed).toHaveAttribute("data-id", infogramId);
		expect(embed).toHaveAttribute("data-type", "interactive");
	});

	it("renders with a full width layoutVariant", () => {
		render(
			<InfogramEmbed
				blok={{
					...mockInfogramProps,
					layoutVariant: "fullwidth",
				}}
			/>
		);
		const embed = screen.getByTestId(infogramId);
		expect(embed.className).toContain("infogram-embed");
		expect(embed.className).not.toContain("infogramEmbed__constarined");
	});

	it("shows error message when URL is invalid", () => {
		render(
			<InfogramEmbed
				blok={{
					...mockInfogramProps,
					infogramUrl: "",
				}}
			/>
		);
		expect(
			screen.getByText(/Invalid or missing Infogram URL/i)
		).toBeInTheDocument();
	});

	it("does not inject script again if already in DOM", () => {
		// Manually add the script element before rendering
		const script = document.createElement("script");
		script.id = "infogram-async";
		document.body.appendChild(script);

		render(
			<InfogramEmbed
				blok={{
					...mockInfogramProps,
					infogramUrl: validUrl,
				}}
			/>
		);

		expect(screen.queryByTestId("mock-script")).not.toBeInTheDocument();
	});

	it("calls infogramEmbeds.load if script already exists", () => {
		// Create script before render to simulate existing load
		const script = document.createElement("script");
		script.id = "infogram-async";
		document.body.appendChild(script);

		render(
			<InfogramEmbed
				blok={{
					...mockInfogramProps,
					infogramUrl: validUrl,
				}}
			/>
		);

		expect(window.infogramEmbeds?.load).toHaveBeenCalled();
	});
});
