import { Document } from "@nice-digital/search-client";

import { formatDateStr } from "@/utils/index";

type FormattedMetaItem = {
	visibleLabel?: boolean;
	label: string;
	value: string;
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

const pushToArray = (
	arr: FormattedMetaItem[],
	visibleLabel: boolean,
	label: string,
	value: string
) => {
	arr.push({ visibleLabel, label, value });
};

export function searchFormatMeta(item: Document): Array<FormattedMetaItem> {
	const { publicationDate, lastUpdated, niceResultType, resourceType } = item;

	const items: FormattedMetaItem[] = [];

	if (niceResultType || (resourceType && resourceType.length > 0)) {
		pushToArray(
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
		pushToArray(items, true, "Last updated", formatDateStr(lastUpdated));
	} else if (
		publicationDate &&
		!isTopicPage(niceResultType) &&
		isCategorised(item)
	) {
		pushToArray(items, true, "Published", formatDateStr(publicationDate));
	}

	if (items.length > 0) {
		return items;
	} else {
		return [];
	}
}
