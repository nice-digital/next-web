import { ContentPart } from "@/feeds/publications/types";

/**
 * Filters and maps an array of content parts to a specific type.
 *
 * @export
 * @template T - Type "T" can be either "UploadAndConvertContentPart", "EditableContentPart", "UploadContentPart", or "ExternalUrlContentPart"
 * @param {ContentPart[] | ContentPart} contentParts - The array of content parts or content part object to filter, each with a "type" property.
 * @param {string} type - The type of content parts to filter by (example: "UploadAndConvertContentPart").
 * @returns {ContentPart[] | ContentPart | undefined} - returns an array of content parts a content part object or undefined.
 */
export function fetchAndMapContentParts<T>(
	contentParts: ContentPart[] | ContentPart,
	type: string
): T[] | T | undefined {
	const contentPartsToArray = Array.isArray(contentParts)
		? contentParts
		: [contentParts];
	const contentPartsCorrectType = contentPartsToArray.filter(
		(part) => part["type"] === type
	) as unknown[];

	if (contentPartsCorrectType.length === 1) {
		return contentPartsCorrectType[0] as T;
	}

	if (contentPartsCorrectType.length > 1) {
		return contentPartsCorrectType as T[];
	}

	return;
}
