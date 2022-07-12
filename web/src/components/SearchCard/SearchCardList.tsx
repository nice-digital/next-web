import React, { FC } from "react";

import { Card } from "@nice-digital/nds-card";
import { Document } from "@nice-digital/search-client";

import { SearchSections } from "@/components/SearchSections/SearchSections";
import { formatDateStr } from "@/utils/index";

import styles from "./SearchCardList.module.scss";

export interface SearchCardListProps {
	documents: Document[];
}

type FormattedMetaItem = {
	visibleLabel?: boolean;
	label: string;
	value: string;
};

type MetaProps = {
	metadata?: FormattedMetaItem[];
};

const isTopicPage = (resultType: string) => {
	return resultType == "Topic page";
};

const isCategorised = (item: Document) => {
	const result =
		item.niceResultType ||
		item.niceDocType.length > 0 ||
		item.resourceCategory ||
		item.resourceType.length > 0;

	return !!result;
};

const pushMetaItemToArray = (
	arr: FormattedMetaItem[],
	visibleLabel: boolean,
	label: string,
	value: string
) => {
	arr.push({ visibleLabel, label, value });
};

function searchFormatMeta(item: Document): Array<FormattedMetaItem> {
	const { publicationDate, lastUpdated, niceResultType, resourceType } = item;

	const items: FormattedMetaItem[] = [];

	if (niceResultType || (resourceType && resourceType.length > 0)) {
		pushMetaItemToArray(
			items,
			false,
			"Result type",
			(niceResultType || resourceType[0]) as string
		);
	}

	if (
		lastUpdated &&
		lastUpdated !== publicationDate &&
		!isTopicPage(niceResultType) &&
		isCategorised(item)
	) {
		pushMetaItemToArray(
			items,
			true,
			"Last updated",
			formatDateStr(lastUpdated)
		);
	} else if (
		publicationDate &&
		!isTopicPage(niceResultType) &&
		isCategorised(item)
	) {
		pushMetaItemToArray(
			items,
			true,
			"Published",
			formatDateStr(publicationDate)
		);
	}

	if (items.length > 0) {
		return items;
	} else {
		return [];
	}
}

export const SearchCardList: FC<SearchCardListProps> = ({ documents }) => {
	return (
		<ol className={styles.list}>
			{documents.map((item: Document) => {
				const { id, title, guidanceRef, pathAndQuery, teaser, subSections } =
					item;

				const metaProps: MetaProps = {};

				if (searchFormatMeta(item).length > 0) {
					metaProps.metadata = searchFormatMeta(item);
				} else {
					delete metaProps.metadata;
				}

				return (
					<li className={styles.listItem} key={id}>
						<Card
							className={styles.card}
							elementType="div"
							headingText={<span dangerouslySetInnerHTML={{ __html: title }} />}
							headinglink={pathAndQuery}
							summary={<span dangerouslySetInnerHTML={{ __html: teaser }} />}
							link={{
								destination: pathAndQuery,
							}}
							{...metaProps}
						/>
						{subSections && subSections.length > 0 ? (
							<SearchSections
								subSections={subSections}
								guidanceRef={guidanceRef}
							/>
						) : null}
					</li>
				);
			})}
		</ol>
	);
};
