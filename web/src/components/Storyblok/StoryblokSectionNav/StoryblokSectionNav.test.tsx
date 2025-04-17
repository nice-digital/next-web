import { render, screen } from "@testing-library/react";

import { StoryblokSectionNav } from "./StoryblokSectionNav";
import mockData from "@/mockData/storyblok/sectionNavData.json";

// Example mock data for the StoryblokSectionNav component

describe("StoryblokSectionNav", () => {
	it("should render the parent and child links correctly", () => {
		render(<StoryblokSectionNav tree={mockData.tree} slug={mockData.slug} />);

		// Check if the parent link is rendered
		const parentLink = screen.getByText(
			"Cost saving, resource planning and audit"
		);
		expect(parentLink).toBeInTheDocument();
		expect(parentLink).toHaveClass(
			"stacked-nav__root stacked-nav__root--no-link"
		);
	});
	it("should not render the parent and child links correctly", () => {
		render(<StoryblokSectionNav tree={[]} slug={mockData.slug} />);

		// Check if the parent link is rendered
		const parentLink = screen.queryByText(
			"Cost saving, resource planning and audit"
		);
		expect(parentLink).not.toBeInTheDocument();
	});
	it("should render the current level and level above it correctly when there are no children", () => {
		render(
			<StoryblokSectionNav
				tree={mockData.currentPageNoChildrenTree}
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
				tree={mockData.currentPageNoChildrenTree}
				slug={
					"implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/smoking-cessation"
				}
			/>
		);

		const link = screen.getByRole("link", { name: /smoking cessation/i });
		expect(link).toHaveAttribute("aria-current", "true");
	});

	it("should not highlight the child link if the slug doesn't match", () => {
		render(
			<StoryblokSectionNav
				tree={mockData.currentPageNoChildrenTree}
				slug={
					"implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/nice-and-core20plus5-adults"
				}
			/>
		);

		const link = screen.getByRole("link", { name: /smoking cessation/i });
		console.log(link.outerHTML);
		expect(link).toHaveAttribute("aria-current", "false");
	});
	it("should highlight the current  link based on the slug", () => {
		render(
			<StoryblokSectionNav
				tree={mockData.topLevelTree}
				slug={"contact-us"}
			/>
		);

		const link = screen.getByRole("link", { name: /Contact us/i });
		expect(link).toHaveAttribute("aria-current", "true");
	});
});
