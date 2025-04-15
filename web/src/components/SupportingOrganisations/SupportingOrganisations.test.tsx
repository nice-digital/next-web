import { render, screen } from "@testing-library/react";

import {
	SupportingOrganisations,
	type SupportingOrganisationsProps,
} from "./SupportingOrganisations";

describe("Supporting Organisations", () => {
	const defaultProps: SupportingOrganisationsProps = {
		supportingList: [
			{
				name: "Royal College of Physicians (RCP)",
				url: "http://www.rcplondon.ac.uk/",
				logo: { url: "/organisation/NICEORG004/Logo/Normal" },
			},
			{
				name: "UK Clinical Pharmacy Association (UKCPA)",
				url: "http://ukclinicalpharmacy.org/",
				logo: {
					url: "",
				},
			},
		],
		productTypeName: "Public health guideline",
	};

	it("should render heading for supporting organisations", () => {
		render(
			<SupportingOrganisations
				supportingList={defaultProps.supportingList}
				productTypeName={defaultProps.productTypeName}
			/>
		);
		expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
			"Supporting organisations"
		);
	});

	it("should render each supporting organisations with links", () => {
		render(
			<SupportingOrganisations
				supportingList={defaultProps.supportingList}
				productTypeName={defaultProps.productTypeName}
			/>
		);
		const links = screen.getAllByRole("link");
		expect(links).toHaveLength(defaultProps.supportingList.length);

		links.forEach((link, index) => {
			expect(link).toHaveTextContent(defaultProps.supportingList[index].name);
			expect(link).toHaveAttribute(
				"href",
				defaultProps.supportingList[index].url
			);
		});
	});

	it("should not render when supporting organisations is empty", () => {
		render(
			<SupportingOrganisations
				supportingList={[]}
				productTypeName={defaultProps.productTypeName}
			/>
		);
		expect(
			screen.queryByText("Supporting organisations")
		).not.toBeInTheDocument();
	});
});
