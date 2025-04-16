import { render, screen } from "@testing-library/react";

import { StoryblokSectionNav } from "./StoryblokSectionNav";

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

					slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities",

					parent_id: 642423873,
					name: "NICE and health inequalities",
					is_folder: true,
					published: false,
					is_startpage: false,

					real_path:
						"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities",
				},
				{
					id: 642433119,

					slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/resource-planner",

					parent_id: 642423873,
					name: "Resource planner",
					is_folder: false,
					published: true,
					is_startpage: false,

					real_path:
						"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/resource-planner",
				},
			],
		},
	],
	currentPageNoChildrenTree: [
		{
			id: 642430801,

			slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/",

			parent_id: 642423884,
			name: "NICE and health inequalities",
			is_folder: false,
			published: true,
			is_startpage: true,

			real_path:
				"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/",
			childLinks: [],
		},
		{
			id: 642423891,

			slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults",

			parent_id: 642423884,
			name: "NICE and Core20PLUS5 - adults",
			is_folder: true,
			published: false,
			is_startpage: false,

			real_path:
				"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults",
			childLinks: [
				{
					id: 650167013,

					slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/nice-and-core20plus5-adults",

					parent_id: 642423891,
					name: "Core20PLUS5 adults-OG",
					is_folder: false,
					published: true,
					is_startpage: false,

					real_path:
						"/implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/nice-and-core20plus5-adults",
					childLinks: [],
				},
				{
					id: 642433206,

					slug: "implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/smoking-cessation",

					parent_id: 642423891,
					name: "smoking cessation",
					is_folder: false,
					published: true,
					is_startpage: false,

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
				currentPageNoChildrenTree={[]}
				slug={mockData.slug}
			/>
		);

		// Check if the parent link is rendered
		const parentLink = screen.getByText(
			"Cost saving, resource planning and audit"
		);
		expect(parentLink).toBeInTheDocument();
		expect(parentLink).toHaveClass(
			"stacked-nav__root stacked-nav__root--no-link"
		);
	});

	it("should highlight the current child link based on the slug", () => {
		render(
			<StoryblokSectionNav
				parentChildLinksTreeArray={mockData.parentChildLinksTreeArray}
				currentPageNoChildrenTree={mockData.currentPageNoChildrenTree}
				slug={
					"implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/smoking-cessation"
				}
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
				currentPageNoChildrenTree={mockData.currentPageNoChildrenTree}
				slug={
					"implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/nice-and-core20plus5-adults/smoking-cessation"
				}
			/>
		);

		// Get all child links and check the aria-current value
		const childLinks = mockData.currentPageNoChildrenTree[0].childLinks;

		// Check the aria-current value for each child link
		childLinks.forEach((link) => {
			if (link.slug === mockData.slug) {
				// The current link should have aria-current="true"
				expect(link).toHaveAttribute("aria-current", "true");
			} else {
				// Other links should have aria-current="false"
				expect(link).toHaveAttribute("aria-current", "false");
			}
		});
	});
});
