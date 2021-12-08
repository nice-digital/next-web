import { SearchResultsSuccess, Document } from "@nice-digital/search-client";

import { dateFormatShort } from "@/utils/constants";
import { formatDateStr } from "@/utils/index";

type FormattedMetaItem = {
	visibleLabel?: boolean;
	label: string;
	value: string;
};

export function searchFormatMeta(item: Document): Array<FormattedMetaItem> {
	const {
		id,
		title,
		guidanceRef,
		publicationDate,
		lastUpdated,
		pathAndQuery,
		teaser,
		subSectionLinks,
		niceResultType,
		niceDocType,
		resourceCategory,
		resourceType,
		niceAdviceType,
		niceGuidanceType,
	} = item;

	const items: FormattedMetaItem[] = [];

	if (niceResultType || niceDocType.length > 0) {
		console.log({ niceResultType }, { niceDocType });
		items.push({
			visibleLabel: true,
			label: "Type",
			value: (niceResultType && niceResultType.length > 0
				? niceResultType
				: niceDocType) as string,
		});
	}
	if (resourceCategory || resourceType) {
		items.push({
			visibleLabel: false,
			label: (resourceCategory && "DEBUG Resource category:") || "Resource",
			value: (resourceType && resourceType.length > 0
				? resourceType[0]
				: resourceCategory && resourceCategory[0]) as string,
		});
	}
	if (lastUpdated && lastUpdated !== publicationDate) {
		items.push({
			visibleLabel: true,
			label: "Last updated",
			value: formatDateStr(lastUpdated),
		});
	} else if (publicationDate) {
		items.push({
			visibleLabel: true,
			label: "Published",
			value: formatDateStr(publicationDate),
		});
	}

	return items;
}
