import React from "react";

import { PageHeader, PageHeaderProps } from "@nice-digital/nds-page-header";
import { Tag } from "@nice-digital/nds-tag";

export interface NewsPageHeaderProps
	extends Omit<PageHeaderProps, "isFullWidth"> {
	date: string;
	showFooter: boolean;
}

function formatDate(date: string): string {
	return new Intl.DateTimeFormat("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(date));
}

export const NewsPageHeader: React.FC<NewsPageHeaderProps> = ({
	heading,
	lead,
	breadcrumbs,
	date,
	showFooter = false,
}) => {
	const NewsPageHeaderMeta = () => {
		{
			/** TODO: Move to own component to reuse across blog and news article pages?*/
		}

		if (!showFooter) {
			return null;
		}

		{
			/** TODO: Manage Tag content dynamically with a util funciton to grab the right part of the path to distinguish between news articles, in-depth, podcast, etc? */
		}

		const pageType = "News";
		return (
			<p>
				<Tag outline>{pageType}</Tag> &nbsp;
				{typeof date === "string" && (
					<time dateTime={date}>{formatDate(date)}</time>
				)}
			</p>
		);
	};

	return (
		<PageHeader
			isFullWidth={true}
			breadcrumbs={breadcrumbs}
			heading={heading}
			lead={lead}
			metadata={[<NewsPageHeaderMeta key="page-header-meta" />]}
		/>
	);
};
