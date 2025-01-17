/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";

import { PromoBox, type PromoBoxProps } from "./PromoBox";

const mockPromoBox: PromoBoxProps = {
	blok: {
		heading: "Mock promo box title",
		headingLevel: "2",
		image: {
			filename: "https://placebacon.net/130/210?image=4",
			id: 123456789,
			name: "Delicious bacon",
			alt: null,
			fieldtype: "asset",
			title: null,
			focus: null,
		},
		useVideo: false,
		body: {
			type: "Mock rich text",
		},
		_uid: "123456789",
		component: "promoBox",
		verticalPadding: "medium",
	},
};

describe("Promo box component", () => {
	it("should match snapshot", () => {
		const { container } = render(<PromoBox {...mockPromoBox} />);
		expect(container).toMatchSnapshot();
	});

	it("should match snapshot if image is provided and set as portrait", () => {
		const mockPromoBoxPortrait: PromoBoxProps = {
			blok: {
				...mockPromoBox.blok,
				imageAspectRatio: "portrait",
			},
		};
		const { container } = render(<PromoBox {...mockPromoBoxPortrait} />);
		expect(container).toMatchSnapshot();
	});

	it("should render a button if one is supplied", () => {
		const box: PromoBoxProps = {
			blok: {
				...mockPromoBox.blok,
				cta: [
					{
						text: "Press me",
						link: {
							id: "",
							url: "https://www.example.com/some-test-url",
							linktype: "url",
							fieldtype: "multilink",
							cached_url: "https://www.example.com/some-test-url",
						},
						variant: "primary",
						_uid: "123456789",
						component: "buttonLink",
					},
				],
			},
		};

		render(<PromoBox {...box} />);
		expect(screen.getByRole("link")).toHaveTextContent("Press me");
		expect(screen.getByRole("link")).toHaveAttribute(
			"href",
			"https://www.example.com/some-test-url"
		);
	});

	it("should switch the side of the media if specified", () => {
		const box: PromoBoxProps = {
			blok: {
				...mockPromoBox.blok,
				swapMediaSide: true,
			},
		};

		render(<PromoBox {...box} />);
		expect(
			screen.getByRole("heading", { name: mockPromoBox.blok.heading })
				.parentElement
		).toHaveAttribute("data-g", "12 md:7 md:push:5");
	});

	it("should render video if specified", () => {
		const box: PromoBoxProps = {
			blok: {
				...mockPromoBox.blok,
				image: {
					filename: null,
					id: 123456789,
					name: "Delicious bacon",
					alt: null,
					fieldtype: "asset",
					title: null,
					focus: null,
				},
				useVideo: true,
				youtubeEmbed: [
					{
						title: "Test Youtube title",
						source: "wwSzpaTHyS8",
						_uid: "123456",
						component: "youtubeEmbed",
					},
				],
			},
		};

		render(<PromoBox {...box} />);
		expect(screen.getByRole("button")).toHaveClass("youtubePlayButton");
	});

	it("should render heading as h2 when headingLevel is not specified", () => {
		render(<PromoBox {...mockPromoBox} />);
		expect(
			screen.getByRole("heading", { level: 2, name: "Mock promo box title" })
		).toBeInTheDocument();
	});

	it("should render heading as h3 when headingLevel has been selected as 3", () => {
		const mockPromoBoxPropsHeading3: PromoBoxProps = {
			blok: {
				...mockPromoBox.blok,
				headingLevel: "3",
			},
		};
		render(<PromoBox {...mockPromoBoxPropsHeading3} />);
		expect(
			screen.getByRole("heading", {
				level: 3,
				name: mockPromoBoxPropsHeading3.blok.heading,
			})
		).toBeInTheDocument();
	});

	it("should apply transparent class to article element", () => {
		const mockPromoBoxPropsTransparent: PromoBoxProps = {
			blok: {
				...mockPromoBox.blok,
				isTransparent: true,
			},
		};
		render(<PromoBox {...mockPromoBoxPropsTransparent} />);
		const article = document.querySelector("article");
		expect(article?.classList.contains("transparent")).toBe(true);
	});
});
