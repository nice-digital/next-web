import React from "react";

import { Tag } from "@nice-digital/nds-tag";

import { formatDateStr } from "@/utils/datetime";
import { getNewsType, newsTypes } from "@/utils/storyblok";

import styles from "./NewsPageHeaderFooter.module.scss";

type storyType = keyof typeof newsTypes;

export interface NewsPageHeaderFooterProps {
	date: string;
	pageType: storyType;
}

export const NewsPageHeaderFooter: React.FC<NewsPageHeaderFooterProps> = ({
	date,
	pageType,
}) => {
	const storyType = getNewsType(pageType);

	return (
		<div className={styles.footer}>
			<Tag outline data-testid="pageTag">
				{storyType}
			</Tag>
			{typeof date === "string" && (
				<time dateTime={date}>{formatDateStr(date)}</time>
			)}
		</div>
	);
};
