import React from "react";

import { PageHeader, PageHeaderProps } from "@nice-digital/nds-page-header";
import { Tag } from "@nice-digital/nds-tag";

import { formatDateStr } from "@/utils/datetime";

export interface NewsPageHeaderProps
	extends Omit<PageHeaderProps, "isFullWidth" | "metadata"> {
	date?: string;
	showFooter?: boolean;
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
			/** NOTE: we could use the same component across listing pages and slug pages.*/
			/** TODO: Move to own component to reuse across blog and news article pages?*/
			/** TODO: Manage Tag content dynamically with a util function to grab the right part of the path to distinguish between news articles, in-depth, podcast, etc? */
		}

		if (!showFooter) {
			return null;
		}

		const pageType = "News";

		return (
			<p>
				<Tag outline data-testid="pageTag">
					{pageType}
				</Tag>{" "}
				&nbsp;
				{typeof date === "string" && (
					<time dateTime={date}>{formatDateStr(date)}</time>
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
			description={[<NewsPageHeaderMeta key="page-header-meta" />]}
		/>
	);
};
