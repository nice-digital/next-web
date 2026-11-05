import React from "react";

import { PageHeader, PageHeaderProps } from "@nice-digital/nds-page-header";
import { Tag } from "@nice-digital/nds-tag";

import { formatDateStr } from "@/utils/datetime";

// PageHeaderProps carries an index signature (`[prop: string]: unknown`), so
// `Omit<PageHeaderProps, ...>` widens its named members to `unknown`. Re-declare
// the members this component forwards with their concrete `PageHeaderProps`
// types so they stay assignable to `PageHeader`.
export interface NewsPageHeaderProps
	extends Omit<PageHeaderProps, "isFullWidth" | "metadata"> {
	heading: PageHeaderProps["heading"];
	lead?: PageHeaderProps["lead"];
	breadcrumbs?: PageHeaderProps["breadcrumbs"];
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
			variant="fullWidthLight"
			breadcrumbs={breadcrumbs}
			heading={heading}
			lead={lead}
			description={[<NewsPageHeaderMeta key="page-header-meta" />]}
			verticalPadding="loose"
		/>
	);
};
