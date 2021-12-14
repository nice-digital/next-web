import { Document } from "@nice-digital/search-client";

import { formatDateStr } from "@/utils/index";

type FormattedMetaItem = {
	visibleLabel?: boolean;
	label: string;
	value: string;
};

export function searchFormatMeta(item: Document): Array<FormattedMetaItem> {
	const {
		publicationDate,
		lastUpdated,
		niceResultType,
		niceDocType,
		resourceCategory,
		resourceType,
	} = item;

	const items: FormattedMetaItem[] = [];

	const isTopicPage = (resultType: string) => {
		return resultType == "Topic page";
	};

	const isCategorised = (
		resultType: string,
		docType: readonly string[],
		resourceCategory: readonly string[] | null,
		resourceType: readonly string[]
	) => {
		const result =
			resultType ||
			docType.length > 0 ||
			resourceCategory ||
			resourceType.length > 0;

		return !!result;
	};

	if (niceResultType || (resourceType && resourceType.length > 0)) {
		items.push({
			visibleLabel: false,
			label: "Result type",
			value: (niceResultType || resourceType[0]) as string,
		});
	}

	if (
		lastUpdated &&
		lastUpdated !== publicationDate &&
		!isTopicPage(niceResultType) &&
		isCategorised(niceResultType, niceDocType, resourceCategory, resourceType)
	) {
		items.push({
			visibleLabel: true,
			label: "Last updated",
			value: formatDateStr(lastUpdated),
		});
	} else if (
		publicationDate &&
		!isTopicPage(niceResultType) &&
		isCategorised(niceResultType, niceDocType, resourceCategory, resourceType)
	) {
		items.push({
			visibleLabel: true,
			label: "Published",
			value: formatDateStr(publicationDate),
		});
	}

	if (items.length > 0) {
		return items;
	} else {
		return [];
	}
}
