import { render, screen, within } from "@testing-library/react";
import  {StoryblokSectionNav}  from "./StoryblokSectionNav";

// Example mock data for the StoryblokSectionNav component
const mockData = {
	parentChildLinksTreeArray: [
		{
			id: 642423873,
			uuid: "43715ed7-016d-4e5d-b43a-14fa7cd08b23",
			slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit",
			path: null,
			parent_id: 563840532,
			name: "Cost saving, resource planning and audit",
			is_folder: true,
			published: false,
			is_startpage: false,
			position: -160,
			real_path:
				"/implementing-nice-guidance/cost-saving-resource-planning-and-audit",
			childLinks: [
				{
					id: 642423884,
					uuid: "6d8b8718-c16c-42a9-9072-9333e37775c5",
					slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities",
					path: null,
					parent_id: 642423873,
					name: "NICE and health inequalities",
					is_folder: true,
					published: false,
					is_startpage: false,
					position: -120,
					real_path:
						"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities",
				},
				{
					id: 642433119,
					uuid: "48e125b9-f1a2-4ed7-899b-410a24fa53f5",
					slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/resource-planner",
					path: null,
					parent_id: 642423873,
					name: "Resource planner",
					is_folder: false,
					published: true,
					is_startpage: false,
					position: -10,
					real_path:
						"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/resource-planner",
				},
			],
		},
	],
	parentAndSiblingLinksElse: [
		{
			id: 642430801,
			uuid: "d64e14f1-d0ed-4d1a-b9fd-aaf2412c9f4e",
			slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/",
			path: null,
			parent_id: 642423884,
			name: "NICE and health inequalities",
			is_folder: false,
			published: true,
			is_startpage: true,
			position: -270,
			real_path:
				"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/",
			childLinks: [],
		},
		{
			id: 642423891,
			uuid: "1cb73a52-ce9a-4b96-98c4-d5b420ca850c",
			slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults",
			path: null,
			parent_id: 642423884,
			name: "NICE and Core20PLUS5 - adults",
			is_folder: true,
			published: false,
			is_startpage: false,
			position: -220,
			real_path:
				"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults",
			childLinks: [
				{
					id: 650167013,
					uuid: "be3b4fa3-a424-410f-83c2-49e17f2ea142",
					slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/nice-and-core20plus5-adults",
					path: null,
					parent_id: 642423891,
					name: "Core20PLUS5 adults-OG",
					is_folder: false,
					published: true,
					is_startpage: false,
					position: 30,
					real_path:
						"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/nice-and-core20plus5-adults",
					childLinks: [],
				},
				{
					id: 642433206,
					uuid: "188e69ac-02ee-47d7-ad5b-1bea3b237448",
					slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/smoking-cessation",
					path: null,
					parent_id: 642423891,
					name: "smoking cessation",
					is_folder: false,
					published: true,
					is_startpage: false,
					position: 40,
					real_path:
						"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/smoking-cessation",
					childLinks: [],
				},
			],
		},
	],
	slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/smoking-cessation", // current slug
};

describe("StoryblokSectionNav", () => {
	it("should render the parent and child links correctly", () => {
		render(
			<StoryblokSectionNav
				parentChildLinksTreeArray={mockData.parentChildLinksTreeArray}
				parentAndSiblingLinksElse={[]}
				slug={mockData.slug}
			/>
		);

		// Check if the parent link is rendered
		const parentLink = screen.getByText(
			"Cost saving, resource planning and audit"
		);
		expect(parentLink).toBeInTheDocument();
		expect(parentLink).toHaveClass("stacked-nav__root stacked-nav__root--no-link");
	});

	it("should highlight the current child link based on the slug", () => {
		render(
			<StoryblokSectionNav
				parentChildLinksTreeArray={mockData.parentChildLinksTreeArray}
				parentAndSiblingLinksElse={mockData.parentAndSiblingLinksElse}
				slug={"implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/smoking-cessation"}
			/>
		);

		// Check if the correct child link has the "content-wrapper" class
		const childLink1 = screen.getByText("Core20PLUS5 adults-OG");
		const childLink2 = screen.getByText("smoking cessation");

		expect(childLink1).toHaveClass("stacked-nav__content-wrapper");
		expect(childLink2).toHaveClass("stacked-nav__content-wrapper");
	});
	it("should highlight the current child link based on the slug", () => {
		render(
			<StoryblokSectionNav
				parentChildLinksTreeArray={[]}
				parentAndSiblingLinksElse={mockData.parentAndSiblingLinksElse}
				slug={
					"implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/nice-and-core20plus5-adults/smoking-cessation"
				}
			/>
		);

		// Get all child links and check the aria-current value
    const childLinks = mockData.parentAndSiblingLinksElse[0].childLinks;

    // Check the aria-current value for each child link
    childLinks.forEach((link) => {
        if (link.slug=== mockData.slug) {
            // The current link should have aria-current="true"
            expect(link).toHaveAttribute('aria-current', 'true');
        } else {
            // Other links should have aria-current="false"
            expect(link).toHaveAttribute('aria-current', 'false');
        }
    });
	});
});
