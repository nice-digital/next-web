/* eslint-disable testing-library/no-node-access */
import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import { ResourceList, type ResourceListProps } from "./ResourceList";

(useRouter as jest.Mock).mockReturnValue({
	events: {
		on: jest.fn(),
		off: jest.fn(),
	},
});

describe("ResourceList", () => {
	const props: ResourceListProps = {
		title: "Some title",
		lead: "Some lead text",
		groups: [
			{
				title: "Group 1",
				subGroups: [
					{
						title: "Sub group 1",
						resourceLinks: [
							{
								title: "Resource 1",
								href: "/resource-1",
								type: "Sub group 1",
							},
							{
								title: "Resource 2",
								href: "/resource-2",
								type: "Sub group 1",
							},
						],
					},
					{
						title: "Sub group 2",
						resourceLinks: [
							{
								title: "Resource 3",
								href: "/resource-3",
								type: "Sub group 2",
							},
						],
					},
				],
			},
			{
				title: "Group 2",
				subGroups: [
					{
						title: "Sub group 3",
						resourceLinks: [
							{
								title: "Resource 4",
								href: "/resource-4",
								type: "Sub group 3",
							},
						],
					},
				],
			},
			{
				title: "No resources",
				subGroups: [
					{
						title: "No resources",
						resourceLinks: [],
					},
				],
			},
		],
	};

	it("should render given title as heading 2", () => {
		render(<ResourceList {...props} />);

		expect(
			screen.getByRole("heading", { level: 2, name: "Some title" })
		).toBeInTheDocument();
	});

	it("should render given lead text", () => {
		render(<ResourceList {...props} />);

		expect(screen.getByText("Some lead text")).toBeInTheDocument();
	});

	it("should not render groups that have no resources", () => {
		render(<ResourceList {...props} />);

		expect(screen.queryByText("No resources")).toBeNull();
	});

	it("should render nothing when there are no groups to show", () => {
		const { container } = render(<ResourceList {...props} groups={[]} />);

		expect(container).toBeEmptyDOMElement();
	});

	it("should render on this page menu when there are at least 2 groups to show", () => {
		render(<ResourceList {...props} />);

		expect(
			screen.getByRole("heading", { level: 2, name: "On this page" })
		).toBeInTheDocument();
	});

	it("should render on this page link to each group section", () => {
		render(<ResourceList {...props} />);

		expect(screen.getByRole("link", { name: "Group 1" })).toHaveAttribute(
			"href",
			"#group-1"
		);

		expect(screen.getByRole("link", { name: "Group 2" })).toHaveAttribute(
			"href",
			"#group-2"
		);
	});

	it("should not render on this page menu when there are less than 2 groups to show", () => {
		render(<ResourceList {...props} groups={[props.groups[0]]} />);

		expect(
			screen.queryByRole("heading", { level: 2, name: "On this page" })
		).toBeNull();
	});

	it("should render heading 3 for each group", () => {
		render(<ResourceList {...props} />);

		expect(
			screen.getByRole("heading", { level: 3, name: "Group 1" })
		).toBeInTheDocument();

		expect(
			screen.getByRole("heading", { level: 3, name: "Group 2" })
		).toBeInTheDocument();
	});

	it("should render on this page target id attribute on each group heading", () => {
		render(<ResourceList {...props} />);

		expect(
			screen.getByRole("heading", { level: 3, name: "Group 1" })
		).toHaveAttribute("id", "group-1");

		expect(
			screen.getByRole("heading", { level: 3, name: "Group 2" })
		).toHaveAttribute("id", "group-2");
	});

	it("should render heading 4 for each sub group", () => {
		render(<ResourceList {...props} />);

		const subGroupHeadings = screen.getAllByRole("heading", { level: 4 });

		expect(subGroupHeadings.map((h) => h.textContent)).toStrictEqual([
			"Sub group 1",
			"Sub group 2",
			"Sub group 3",
		]);
	});

	it("should render visually hidden heading 4 for sub group when sub group has the same title as the group", () => {
		const firstGroup = props.groups[0];
		render(
			<ResourceList
				{...props}
				groups={[
					{
						...firstGroup,
						subGroups: [
							{ ...firstGroup.subGroups[0], title: firstGroup.title },
							firstGroup.subGroups[1],
						],
					},
					props.groups[1],
				]}
			/>
		);

		expect(
			screen.getByRole("heading", { level: 4, name: "Sub group 2" })
		).not.toHaveClass("visually-hidden");

		expect(
			screen.getByRole("heading", { level: 4, name: "Group 1" })
		).toHaveClass("visually-hidden");
	});

	it("should render section labelled by heading for each group", () => {
		render(<ResourceList {...props} />);

		expect(screen.getByRole("region", { name: "Group 1" })).toBeInTheDocument();
		expect(screen.getByRole("region", { name: "Group 2" })).toBeInTheDocument();
	});
});
