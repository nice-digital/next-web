/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";

import { PromoBox, type PromoBoxProps } from "./PromoBox";

const mockPromoBox: PromoBoxProps = {
	blok: {
		heading: "Mock promo box title",
		headingLevel: "2",
		media: [
			{
				_uid: "123456789",
				image: {
					filename: "https://placebacon.net/130/210?image=4",
					id: 123456789,
					name: "Delicious bacon",
					alt: null,
					fieldtype: "asset",
					title: null,
					focus: null,
				},
				component: "imageEmbed",
			},
		],
		body: {
			type: "Mock rich text",
		},
		_uid: "123456789",
		component: "promoBox",
		verticalPadding: "medium",
		content: [],
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
				media: [
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
	it("should render ActionBanner default when it is passed from storyblok", () => {
		const mockPromoBoxPropsWithActionBanner: PromoBoxProps = {
			blok: {
				...mockPromoBox.blok,
				isTransparent: true,
				promotionalContent: [
					{
						cta: [
							{
								_uid: "3feb6440-9c62-4050-b2b4-fa7697f21ca3",
								link: {
									id: "600c4173-54de-4d42-b7cb-92feb3c92228",
									url: "",
									linktype: "story",
									fieldtype: "multilink",
									cached_url: "test-nick",
									story: {
										name: "Test Nick",
										id: 578471746,
										uuid: "600c4173-54de-4d42-b7cb-92feb3c92228",
										slug: "test-nick",
										url: "test-nick",
										full_slug: "test-nick",
										_stopResolving: true,
									},
								},
								text: "CTA Button",
								variant: "cta",
								component: "buttonLink",
							},
						],
						_uid: "9aaa557b-0b49-4efa-8fda-847f39b77c09",
						body: {
							type: "doc",
							content: [
								{
									type: "paragraph",
									content: [
										{
											text: "Promobox with Action Banner",
											type: "text",
										},
									],
								},
							],
						},
						heading: "Promobox with Action Banner",
						variant: "default",
						component: "actionBannerDefault",
					},
				],
			},
		};
		render(<PromoBox {...mockPromoBoxPropsWithActionBanner} />);
		expect(
			screen.getByRole("heading", {
				level: 3,
				name: "Promobox with Action Banner",
			})
		).toBeInTheDocument();
	});
	it("should render  testimonials when it is  passed from storyblok", () => {
		const mockPromoBoxPropsWithTestimonial: PromoBoxProps = {
			blok: {
				...mockPromoBox.blok,
				isTransparent: true,
				promotionalContent: [
					{
						_uid: "e1a57fa5-1f4f-4319-8f1c-c9a9c263935e",
						columns: "1",
						component: "cardGridRowTestimonials",
						gridItems: [
							{
								_uid: "4083c80c-16ab-45a5-b27c-d915b1f9c754",
								image: {
									id: 18781080,
									alt: "",
									name: "",
									focus: "",
									title: "",
									source: "",
									filename:
										"https://local-host-test-nice-org.com/f/292509/2120x1414/dd56873afd/joe-bloggs.jpg",
									copyright: "",
									fieldtype: "asset",
									meta_data: {},
									is_external_url: false,
								},
								variant: "default",
								component: "testimonialGridItem",
								quoteName: "Quote Name",
								quoteRole: "Role",
								quoteText: "Quote Text",
							},
						],
					},
				],
			},
		};
		render(<PromoBox {...mockPromoBoxPropsWithTestimonial} />);
		expect(screen.getByText("Role")).toBeInTheDocument();
		expect(screen.getByText("Quote Name")).toBeInTheDocument();
		expect(screen.getByText("Quote Text")).toBeInTheDocument();
	});
});
