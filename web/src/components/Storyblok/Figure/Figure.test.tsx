/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";

import { Figure } from "./Figure";

describe("Figure component", () => {
	describe("without a caption", () => {
		it.each([
			["undefined", undefined],
			["null", null],
			["empty string", ""],
			["whitespace-only string", "   \t\n  "],
		])(
			"should render media only and no figcaption when caption is %s",
			(_label, caption) => {
				const { container } = render(
					<Figure caption={caption as React.ReactNode}>
						<img alt="media" />
					</Figure>
				);

				expect(screen.getByAltText("media")).toBeInTheDocument();
				// eslint-disable-next-line testing-library/no-container
				expect(container.querySelector("figcaption")).toBeNull();
			}
		);
	});

	describe("with a string caption", () => {
		it("should render a single figcaption after the media", () => {
			const { container } = render(
				<Figure caption="A caption">
					<img alt="media" />
				</Figure>
			);

			// eslint-disable-next-line testing-library/no-container
			const figure = container.querySelector("figure") as HTMLElement;
			// eslint-disable-next-line testing-library/no-node-access
			const figcaptions = figure.querySelectorAll("figcaption");

			expect(figcaptions).toHaveLength(1);

			// figcaption follows the media in DOM order
			const media = screen.getByAltText("media");
			expect(
				media.compareDocumentPosition(figcaptions[0]) &
					Node.DOCUMENT_POSITION_FOLLOWING
			).toBeTruthy();
		});

		it("should render the trimmed caption text", () => {
			render(
				<Figure caption="   A padded caption   ">
					<img alt="media" />
				</Figure>
			);

			const figcaption = screen.getByText("A padded caption");
			expect(figcaption.tagName).toBe("FIGCAPTION");
			expect(figcaption.textContent).toBe("A padded caption");
		});
	});

	describe("with a ReactNode caption", () => {
		it("should render a figcaption when a non-null ReactNode caption is supplied", () => {
			const { container } = render(
				<Figure caption={<span>Rich caption</span>}>
					<img alt="media" />
				</Figure>
			);

			// eslint-disable-next-line testing-library/no-container
			const figcaption = container.querySelector("figcaption");
			expect(figcaption).not.toBeNull();
			expect(screen.getByText("Rich caption")).toBeInTheDocument();
		});
	});

	describe("className", () => {
		it("should apply the optional className to the root figure", () => {
			const { container } = render(
				<Figure className="my-custom-class">
					<img alt="media" />
				</Figure>
			);

			// eslint-disable-next-line testing-library/no-container
			const figure = container.querySelector("figure") as HTMLElement;
			expect(figure).toHaveClass("my-custom-class");
		});
	});
});
