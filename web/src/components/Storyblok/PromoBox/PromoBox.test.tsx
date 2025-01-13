/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";

import { PromoBox, type PromoBoxProps } from "./PromoBox";

const mockPromoBox: PromoBoxProps = {
	blok: {
		heading: "Mock promo box title",
		headingLevel: 2,
		image: {
			filename: "https://placebacon.net/130/210?image=4",
			id: 123456789,
			name: "Delicious bacon",
		},
		useVideo: false,
		body: {
			type: "Mock rich text",
		},
		_uid: "123456789",
		component: "promoBox",
		verticalPadding:"medium",
	},
};

describe("Promo box component", () => {
	it("should match snapshot", () => {
		const { container } = render(<PromoBox {...mockPromoBox} />);
		expect(container).toMatchSnapshot();
	});
	it("should match snapshot", () => {
		const mockPromoBoxPortrait={...mockPromoBox,imageAspectRatio:"portrait"}
		const { container } = render(<PromoBox {...mockPromoBoxPortrait} />);
		expect(container).toMatchSnapshot();
	});
	it("should render a button if one is supplied", () => {
		const box: PromoBoxProps = {
			...mockPromoBox,
			blok: {
				...mockPromoBox.blok,
				cta: [
					{
						text: "Press me",
						link: {
							url: "https://www.example.com/some-test-url",
							linktype: "url",
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
			...mockPromoBox,
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
			...mockPromoBox,
			blok: {
				...mockPromoBox.blok,
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

	it("should render a heading at the correct level if one is specified", () => {
		const box: PromoBoxProps = {
			...mockPromoBox,
		};

		render(<PromoBox {...box} />);
		expect(
			screen.getByRole("heading", { level: 2, name: "Mock promo box title" })
		).toBeInTheDocument();
	});
});
