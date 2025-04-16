import { render, screen } from "@testing-library/react";

import {
	EndorsingOrganisations,
	type EndorsingOrganisationsProps,
} from "./EndorsingOrganisations";

describe("Endorsing bodies", () => {
	const defaultProps: EndorsingOrganisationsProps = {
		endorsingList: [
			{
				name: "Scottish Intercollegiate Guidelines Network (SIGN)",
				url: "https://www.sign.ac.uk",
				logo: {
					url: "",
				},
			},
			{
				name: "British Thoracic Society (BTS)",
				url: "https://www.brit-thoracic.org.uk",
				logo: {
					url: "",
				},
			},
			{
				name: "Royal College of General Practitioners (RCGP)",
				url: "https://www.rcgp.org.uk",
				logo: {
					url: "",
				},
			},
		],
		productTypeName: "Public health guideline",
	};

	it("should render heading for endorsing bodies", () => {
		render(
			<EndorsingOrganisations
				endorsingList={defaultProps.endorsingList}
				productTypeName={defaultProps.productTypeName}
			/>
		);
		expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
			"Endorsing bodies"
		);
	});

	it("should render each endorsing bodies with links", () => {
		render(
			<EndorsingOrganisations
				endorsingList={defaultProps.endorsingList}
				productTypeName={defaultProps.productTypeName}
			/>
		);
		const links = screen.getAllByRole("link");
		expect(links).toHaveLength(defaultProps.endorsingList.length);

		links.forEach((link, index) => {
			expect(link).toHaveTextContent(defaultProps.endorsingList[index].name);
			expect(link).toHaveAttribute(
				"href",
				defaultProps.endorsingList[index].url
			);
		});
	});

	it("should not render when endorsing bodies is empty", () => {
		render(
			<EndorsingOrganisations
				endorsingList={[]}
				productTypeName={defaultProps.productTypeName}
			/>
		);
		expect(screen.queryByText("Endorsing bodies")).not.toBeInTheDocument();
	});
});
