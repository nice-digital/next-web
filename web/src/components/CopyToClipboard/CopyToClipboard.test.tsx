import userEvent from "@testing-library/user-event";
import * as clipboard from "clipboard-polyfill";
import { useRouter } from "next/router";

import { render, screen } from "@/test-utils";

import { CopyToClipboard } from "./CopyToClipboard";

// Used by useLogger under the hood so needs mocking
(useRouter as jest.Mock).mockImplementation(() => ({
	route: "/",
	pathname: "",
	query: "",
}));

jest.mock("clipboard-polyfill", () => ({
	ClipboardItem: jest.fn(),
	write: jest.fn(),
}));

jest.mock("@nice-digital/global-nav", () => ({
	Header: () => null,
	Footer: () => null,
}));

describe("CopyToClipboard", () => {
	// TODO: Work out how to test SSR before useEffect kicks in
	// it("should not render copy button server side", () => {
	// 	render(<CopyToClipboard targetId="test">test</CopyToClipboard>, {
	// 		hydrate: false,
	// 	});

	// 	expect(screen.queryByText("test")).toBeNull();
	// });

	it("should render copy button client side", () => {
		render(
			<CopyToClipboard targetId="test">
				<p>Copy to clipboard</p>
			</CopyToClipboard>
		);

		expect(screen.getByText("Copy to clipboard")).toBeInTheDocument();
	});

	it("should not write to clipboard if target element doesn't exist", () => {
		const targetElement = document.createElement("p");
		targetElement.id = "not-the-target";
		targetElement.textContent = "Target content";
		document.body.appendChild(targetElement);

		render(
			<CopyToClipboard targetId="test">
				<p>Copy to clipboard</p>
			</CopyToClipboard>
		);

		userEvent.click(screen.getByText("Copy to clipboard"));

		expect(clipboard.write).not.toHaveBeenCalled();
	});

	it("should write to target element HTML to the clipboard", () => {
		const targetElement = document.createElement("p");
		targetElement.id = "test";
		targetElement.textContent = "Target content";
		document.body.appendChild(targetElement);

		render(
			<CopyToClipboard targetId={targetElement.id}>
				<p>Copy to clipboard</p>
			</CopyToClipboard>
		);

		userEvent.click(screen.getByText("Copy to clipboard"));

		expect(clipboard.write).toHaveBeenCalledTimes(1);
		expect(clipboard.write).toHaveBeenCalledWith([
			expect.any(clipboard.ClipboardItem),
		]);

		expect(clipboard.ClipboardItem as jest.Mock).toHaveBeenCalledWith({
			"text/html": new Blob([`<p id="test">Target content</p>`], {
				type: "text/html",
			}),
			"text/plain": new Blob(["Paste into Excel to see the results"], {
				type: "text/plain",
			}),
		});
	});
});
