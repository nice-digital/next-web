import React from "react";

import { Tag } from "@nice-digital/nds-tag";

import { formatDateStr } from "@/utils/datetime";

import styles from "./NewsPageHeaderFooter.module.scss";

type componentPageType = "blogPost" | "newsArticle";

export interface NewsPageHeaderFooterProps {
	date?: string;
	pageType?: componentPageType;
}

export const NewsPageHeaderFooter: React.FC<NewsPageHeaderFooterProps> = ({
	date,
	pageType,
}) => {
	let tagValue: string | null = null;

	switch (pageType) {
		case "newsArticle":
			tagValue = "News";
			break;
		case "blogPost":
			tagValue = "Blog";
			break;
		default:
			tagValue = null;
			break;
	}

	return (
		<div className={styles["page-header-footer"]}>
			<Tag outline data-testid="pageTag">
				{tagValue}
			</Tag>
			{typeof date === "string" && (
				<time dateTime={date}>{formatDateStr(date)}</time>
			)}
		</div>
	);
};
