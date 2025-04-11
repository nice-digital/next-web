import { render, screen } from "@testing-library/react";

import { EndorsingOrganisations, type EndorsingOrganisationsProps} from "./EndorsingOrganisations"

describe("Endorsing bodies", () =>{

	const defaultProps: EndorsingOrganisationsProps = {
		endorsingList: [
			{
				name: 'Scottish Intercollegiate Guidelines Network (SIGN) ',
				url: 'https://www.sign.ac.uk',
				logo: {
					url: ""
				}
			},
			{
				name: 'British Thoracic Society (BTS)',
				url: 'https://www.brit-thoracic.org.uk',
				logo: {
					url: ""
				}
			},
			{
				name: 'Royal College of General Practitioners (RCGP)',
				url: 'https://www.rcgp.org.uk',
				logo: {
					url: ""
				}
			}
		],
		productTypeName: "Public health guideline",

	};

	it("should render an anchor for each endorsing bodies", () => {
		render(<EndorsingOrganisations
					endorsingList={defaultProps.endorsingList}
					productTypeName={defaultProps.productTypeName} />);
		expect(screen.getAllByRole("link")).toHaveLength(defaultProps.endorsingList.length);
	});

	it("should not show endorsing bodies", () => {
		render(<EndorsingOrganisations
					endorsingList={[]}
					productTypeName={defaultProps.productTypeName} />);
		expect(
			screen.queryByText("Endorsing bodies")
		).not.toBeInTheDocument();
	});
});
