import { render, screen } from "@testing-library/react";

import { PromoBox, type PromoBoxProps } from "./PromoBox";

const mockPromoBox: PromoBoxProps = {
	blok: {
		heading: "Mock promo box title",
		body: {
			type: "Mock rich text",
		},
		_uid: "123456789",
		component: "promoBox",
	},
};

describe("Promo box component", () => {
	it("should match snapshot", () => {
		const { container } = render(<PromoBox {...mockPromoBox} />);
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
						},
						variant: "primary",
						_uid: "123456789",
						component: "button",
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

	it.todo("should switch the side of the media if specified");

	it.todo("should render video if specified");

	it.todo("should render a heading at the correct level if one is specified");
});
