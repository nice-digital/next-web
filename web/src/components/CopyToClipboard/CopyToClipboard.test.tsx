import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as clipboard from "clipboard-polyfill";
import { renderToString } from "react-dom/server";

import { render, screen } from "@/test-utils";

import { CopyToClipboard } from "./CopyToClipboard";

jest.mock("@/logger", () => ({
	useLogger: jest.fn(() => ({
		error: jest.fn(),
	})),
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
	afterEach(() => {
		// We create a target element outside the rendered component so make sure it's cleaned up
		document.body.innerHTML = "";
	});

	it("should not render copy button server side", () => {
		const view = renderToString(
			<CopyToClipboard targetId="test">test</CopyToClipboard>
		);

		expect(view).toBe("");
	});

	it("should render copy button client side", () => {
		render(
			<CopyToClipboard targetId="test">Copy to clipboard</CopyToClipboard>
		);

		expect(screen.getByText("Copy to clipboard")).toBeInTheDocument();
	});

	describe("Success", () => {
		it("should write target element HTML to the clipboard", () => {
			const targetElement = document.createElement("p");
			targetElement.id = "test";
			targetElement.textContent = "Target content";
			document.body.appendChild(targetElement);

			render(
				<CopyToClipboard targetId={targetElement.id}>
					Copy to clipboard
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

		it("should display success message with aria alert after copy works", async () => {
			const targetElement = document.createElement("p");
			targetElement.id = "test";
			document.body.appendChild(targetElement);

			render(
				<CopyToClipboard targetId="test">Copy to clipboard</CopyToClipboard>
			);

			expect(screen.queryByRole("alert")).toBeNull();

			userEvent.click(screen.getByText("Copy to clipboard"));

			const successMessage = await screen.findByRole("alert");

			expect(successMessage).toBeInTheDocument();
			expect(successMessage).toHaveTextContent(
				"Results copied to the clipboard, paste into excel to see the results."
			);
			expect(successMessage).toHaveProperty("tagName", "P");
			expect(successMessage).toHaveAttribute("aria-live", "assertive");
			expect(successMessage).toHaveAttribute("aria-atomic", "true");
		});

		it("should dismiss success message on dismiss button click", async () => {
			const targetElement = document.createElement("p");
			targetElement.id = "test";
			document.body.appendChild(targetElement);

			render(
				<CopyToClipboard targetId="test">Copy to clipboard</CopyToClipboard>
			);

			userEvent.click(screen.getByText("Copy to clipboard"));

			expect(await screen.findByRole("alert")).toBeInTheDocument();

			userEvent.click(screen.getByText("Dismiss message"));

			await waitFor(async () => {
				expect(screen.queryByRole("alert")).toBeNull();
			});
		});

		it("should restore focus to copy button after alert dismiss", async () => {
			const targetElement = document.createElement("p");
			targetElement.id = "test";
			document.body.appendChild(targetElement);

			render(
				<CopyToClipboard targetId="test">Copy to clipboard</CopyToClipboard>
			);

			const copyButton = screen.getByText("Copy to clipboard");
			userEvent.click(copyButton);
			copyButton.blur();

			userEvent.click(await screen.findByText("Dismiss message"));

			expect(copyButton).toHaveFocus();
		});
	});

	describe("Error handling", () => {
		it("should not write to clipboard if target element doesn't exist", () => {
			render(
				<CopyToClipboard targetId="not-a-real-target">
					Copy to clipboard
				</CopyToClipboard>
			);

			userEvent.click(screen.getByText("Copy to clipboard"));

			expect(clipboard.write).not.toHaveBeenCalled();
		});

		it("should display error message with aria alert when target element doesn't exist", async () => {
			render(
				<CopyToClipboard targetId="target-id-that-doesnt-exist">
					Copy to clipboard
				</CopyToClipboard>
			);

			expect(screen.queryByRole("alert")).toBeNull();

			userEvent.click(screen.getByText("Copy to clipboard"));

			const errorMessage = await screen.findByRole("alert");

			expect(errorMessage).toBeInTheDocument();
			expect(errorMessage).toHaveTextContent(
				"Sorry, there was an error copying to the clipboard"
			);
			expect(errorMessage).toHaveProperty("tagName", "P");
			expect(errorMessage).toHaveAttribute("aria-live", "assertive");
			expect(errorMessage).toHaveAttribute("aria-atomic", "true");
		});

		it("should display error message if writing to clipboard fails", async () => {
			const targetElement = document.createElement("p");
			targetElement.id = "target-id";
			targetElement.textContent = "Target content";
			document.body.appendChild(targetElement);

			(clipboard.write as jest.Mock).mockRejectedValue(
				new Error("Error writing to clipboard")
			);

			render(
				<CopyToClipboard targetId="target-id">
					Copy to clipboard
				</CopyToClipboard>
			);

			expect(screen.queryByRole("alert")).toBeNull();

			userEvent.click(screen.getByText("Copy to clipboard"));

			const errorMessage = await screen.findByRole("alert");

			expect(errorMessage).toHaveTextContent(
				"Sorry, there was an error copying to the clipboard"
			);
		});
	});
});
