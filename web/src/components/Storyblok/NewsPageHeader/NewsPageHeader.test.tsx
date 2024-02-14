import { render, screen, within } from "@testing-library/react";

import { Breadcrumb, Breadcrumbs } from "@nice-digital/nds-breadcrumbs";

import { NewsPageHeader } from "./NewsPageHeader";

const NewsArticleBreadCrumbs = (
	<Breadcrumbs>
		<Breadcrumb to="/">Home</Breadcrumb>
		<Breadcrumb to="/news">News</Breadcrumb>
		<Breadcrumb to="/news/articles">News articles</Breadcrumb>
	</Breadcrumbs>
);
const newsPageHeaderProps = {
	heading: "Page title",
	lead: "Page summary",
	breadcrumbs: NewsArticleBreadCrumbs,
	date: "2024-01-31",
};

describe("NewsPageHeader", () => {
	it("should render the NewsPageHeader with title, lead and breadcrumbs", () => {
		render(
			<NewsPageHeader
				heading={newsPageHeaderProps.heading}
				lead={newsPageHeaderProps.lead}
				breadcrumbs={newsPageHeaderProps.breadcrumbs}
			/>
		);

		expect(
			screen.getByRole("heading", { name: "Page title" })
		).toBeInTheDocument();

		expect(screen.getByText("Page summary")).toBeInTheDocument();

		expect(
			screen.getByRole("navigation", { name: "Breadcrumbs" })
		).toBeInTheDocument();
	});

	it('should not render the NewsPageHeader with a date and news tag when "showFooter" is false by default', () => {
		render(
			<NewsPageHeader
				heading={newsPageHeaderProps.heading}
				lead={newsPageHeaderProps.lead}
				breadcrumbs={newsPageHeaderProps.breadcrumbs}
				date={newsPageHeaderProps.date}
			/>
		);

		expect(screen.queryByText("31 January 2024")).not.toBeInTheDocument();
	});

	it("should render the NewsPageHeader Breadrumbs with a link to the news page", () => {
		render(
			<NewsPageHeader
				heading={newsPageHeaderProps.heading}
				lead={newsPageHeaderProps.lead}
				breadcrumbs={newsPageHeaderProps.breadcrumbs}
			/>
		);

		const breadcrumbs = screen.getByRole("navigation", { name: "Breadcrumbs" });

		expect(
			within(breadcrumbs)
				.getAllByRole("link")
				.map((a) => a.textContent)
		).toStrictEqual(["Home", "News", "News articles"]);
	});

	it("should render the NewsPageHeader with a date and news tag when showFooter is set to true and a date is passed ", () => {
		render(
			<NewsPageHeader
				heading={newsPageHeaderProps.heading}
				lead={newsPageHeaderProps.lead}
				breadcrumbs={newsPageHeaderProps.breadcrumbs}
				date={newsPageHeaderProps.date}
				showFooter={true}
			/>
		);
		expect(screen.getByTestId("pageTag")).toHaveTextContent("News");
		expect(screen.getByText("31 January 2024")).toBeInTheDocument();
	});
});
