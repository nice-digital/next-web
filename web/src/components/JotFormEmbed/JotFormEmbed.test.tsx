import { render, screen, fireEvent } from "@testing-library/react";

import { JotFormEmbed } from "./JotFormEmbed";

describe("JotFormEmbed", () => {
	it("should render iframe with title", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		expect(screen.getByTitle("This is a title")).toHaveProperty(
			"tagName",
			"IFRAME"
		);
	});

	it("should create iframe source URL from form id, JotForm base URL and isIframeEmbed querystring", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		expect(screen.getByTitle("This is a title")).toHaveAttribute(
			"src",
			"https://next-web-tests.jotform.com/1234?isIframeEmbed=1"
		);
	});

	it("should allow full screen on iframe", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		expect(screen.getByTitle("This is a title")).toHaveAttribute(
			"allowfullscreen",
			""
		);
	});

	it("should allow geolocation, microphone and camera on iframe", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		expect(screen.getByTitle("This is a title")).toHaveAttribute(
			"allow",
			"geolocation; microphone; camera"
		);
	});

	it("should use hidden overflow style", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		expect(screen.getByTitle("This is a title")).toHaveStyle({
			overflow: "hidden",
		});
	});

	it("should add data attribute with form ID for GTM tracking", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		expect(screen.getByTitle("This is a title")).toHaveAttribute(
			"data-jotform-id",
			"1234"
		);
	});

	it("should use given initial height", () => {
		render(
			<JotFormEmbed jotFormID="1234" title="This is a title" height={999} />
		);

		expect(screen.getByTitle("This is a title")).toHaveStyle({
			height: "999px",
		});
	});

	it("should set height from iframe post message", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		fireEvent(
			window,
			new MessageEvent("message", {
				data: "setHeight:987:1234",
				origin: "https://next-web-tests.jotform.com",
			})
		);

		expect(screen.getByTitle("This is a title")).toHaveStyle({
			height: "987px",
		});
	});

	it("should call given onSubmit callback prop after form submission event", () => {
		const onSubmit = jest.fn();

		render(
			<JotFormEmbed
				jotFormID="1234"
				title="This is a title"
				onSubmit={onSubmit}
			/>
		);

		fireEvent(
			window,
			new MessageEvent("message", {
				data: {
					action: "submission-completed",
					formID: "1234",
				},
				origin: "https://next-web-tests.jotform.com",
			})
		);

		expect(onSubmit).toHaveBeenCalled();
	});

	it("should push submit event to data layer after form submission message", () => {
		const dataLayerPush = jest.spyOn(window.dataLayer, "push");

		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		fireEvent(
			window,
			new MessageEvent("message", {
				data: {
					action: "submission-completed",
					formID: "1234",
				},
				origin: "https://next-web-tests.jotform.com",
			})
		);

		expect(dataLayerPush).toHaveBeenCalledWith({
			event: "Jotform Message",
			jf_id: "1234",
			jf_title: "This is a title",
			jf_type: "submit",
		});

		dataLayerPush.mockReset();
	});

	it("should push progress event to data layer after scroll into view message", () => {
		const dataLayerPush = jest.spyOn(window.dataLayer, "push");

		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		fireEvent(
			window,
			new MessageEvent("message", {
				data: "scrollIntoView::1234",
				origin: "https://next-web-tests.jotform.com",
			})
		);

		expect(dataLayerPush).toHaveBeenCalledWith({
			event: "Jotform Message",
			jf_id: "1234",
			jf_title: "This is a title",
			jf_type: "progress",
		});

		dataLayerPush.mockReset();
	});

	it("should scroll iframe into view in response to scrollIntoView message", () => {
		render(<JotFormEmbed jotFormID="1234" title="This is a title" />);

		const iframe = screen.getByTitle("This is a title"),
			scrollIntoView = jest.fn();

		iframe.scrollIntoView = scrollIntoView;

		fireEvent(
			window,
			new MessageEvent("message", {
				data: "scrollIntoView::1234",
				origin: "https://next-web-tests.jotform.com",
			})
		);

		expect(scrollIntoView).toHaveBeenCalled();
	});
});
