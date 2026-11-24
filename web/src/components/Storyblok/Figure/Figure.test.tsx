/* eslint-disable testing-library/no-node-access */
// Plain <img> is intentional: simple test media, and the parity tests compare
// with the plain <img> markup built by buildImgHtml
/* eslint-disable @next/next/no-img-element */
import { render, screen } from "@testing-library/react";

import { Figure } from "./Figure";
import { getCaption, buildFigureHtml, buildImgHtml } from "./figureCaption";

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

	describe("inContent", () => {
		it("should add the in-content class when set", () => {
			const { container } = render(
				<Figure inContent>
					<img alt="media" />
				</Figure>
			);

			// eslint-disable-next-line testing-library/no-container
			const figure = container.querySelector("figure") as HTMLElement;
			expect(figure).toHaveClass("figure");
			expect(figure).toHaveClass("inContent");
		});

		it("should not add the in-content class by default", () => {
			const { container } = render(
				<Figure>
					<img alt="media" />
				</Figure>
			);

			// eslint-disable-next-line testing-library/no-container
			const figure = container.querySelector("figure") as HTMLElement;
			expect(figure).not.toHaveClass("inContent");
		});
	});
});

describe("getCaption", () => {
	it.each([
		["a string", "A caption", "A caption"],
		["a padded string", "  A caption  ", "A caption"],
		["an empty string", "", undefined],
		["a whitespace-only string", " \t\n ", undefined],
		["undefined", undefined, undefined],
		["null", null, undefined],
		["a number", 3, undefined],
	])("returns the caption for %s", (_label, value, expected) => {
		expect(getCaption(value)).toBe(expected);
	});
});

describe("buildFigureHtml", () => {
	const src = "https://a.storyblok.com/f/1/420x234/abc/image.png";

	// Parses an HTML string the same way the browser would, so it can be compared
	// with the Figure component's rendered DOM
	const parseFigure = (html: string): HTMLElement => {
		const div = document.createElement("div");
		div.innerHTML = html;
		return div.firstElementChild as HTMLElement;
	};

	const mountFigure = (
		caption: string | undefined,
		inContent: boolean,
		alt: string
	): HTMLElement => {
		const { container } = render(
			<Figure caption={caption} inContent={inContent}>
				<img src={src} alt={alt} />
			</Figure>
		);
		// eslint-disable-next-line testing-library/no-container
		return container.querySelector("figure") as HTMLElement;
	};

	it.each([
		["with a caption, in content", "A caption", true],
		["with a caption, not in content", "A caption", false],
		["with a padded caption", "  A caption  ", true],
		["without a caption", undefined, true],
		["with an empty caption", "", true],
		["with a whitespace-only caption", "   ", true],
	])(
		"matches the Figure component's markup %s",
		(_label, caption, inContent) => {
			const html = buildFigureHtml(buildImgHtml(src, "An image"), {
				caption,
				inContent,
			});

			expect(parseFigure(html).outerHTML).toBe(
				mountFigure(caption, inContent, "An image").outerHTML
			);
		}
	);

	it("escapes HTML in the caption and alt text the same way as the Figure component", () => {
		const caption = `<script>alert(1)</script> & "quoted" 'single'`;
		const alt = `"><b>bold</b>`;

		const figure = parseFigure(
			buildFigureHtml(buildImgHtml(src, alt), { caption, inContent: true })
		);

		expect(figure.querySelectorAll("script, b")).toHaveLength(0);
		expect(figure.querySelector("figcaption")?.textContent).toBe(caption);
		expect(figure.outerHTML).toBe(mountFigure(caption, true, alt).outerHTML);
	});

	it("is not in content by default", () => {
		const figure = parseFigure(buildFigureHtml(buildImgHtml(src)));

		expect(figure.className).toBe("figure");
		expect(figure.querySelector("img")).toHaveAttribute("alt", "");
	});
});
