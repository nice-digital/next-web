import { render, screen } from "@testing-library/react";

import { SupportingOrganisations, type SupportingOrganisationsProps} from "./SupportingOrganisations"

describe("Supporting Organisations", () =>{

	const defaultProps: SupportingOrganisationsProps = {
		supportingList: [
			{
				name: 'Royal College of Physicians (RCP)',
				url: 'http://www.rcplondon.ac.uk/',
				logo: { url: '/organisation/NICEORG004/Logo/Normal' }
			},
			{
				name: 'UK Clinical Pharmacy Association (UKCPA)',
				url: 'http://ukclinicalpharmacy.org/',
				logo: {
					url: ""
				}
			}
		],
		productTypeName: "Public health guideline",

	};

	it("should render an anchor for each supporting organisations", () => {
		render(<SupportingOrganisations
					supportingList={defaultProps.supportingList}
					productTypeName={defaultProps.productTypeName} />);
		expect(screen.getAllByRole("link")).toHaveLength(defaultProps.supportingList.length);
	});

	it("should not show supporting organisations", () => {
		render(<SupportingOrganisations
					supportingList={[]}
					productTypeName={defaultProps.productTypeName} />);
		expect(
			screen.queryByText("Supporting organisations")
		).not.toBeInTheDocument();
	});
});
