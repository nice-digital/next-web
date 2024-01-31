import React from "react";

import { PageHeader, PageHeaderProps } from "@nice-digital/nds-page-header";
import { Tag } from "@nice-digital/nds-tag";

import { formatDateStr } from "@/utils/datetime";

export interface NewsPageHeaderProps
	extends Omit<PageHeaderProps, "isFullWidth"> {
	date: string;
	showFooter: boolean;
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
			metadata={[<NewsPageHeaderMeta key="page-header-meta" />]}
		/>
	);
};
