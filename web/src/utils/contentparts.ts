/**
 * Filters and maps an array of content parts to a specific type.
 *
 * @export
 * @template T - Type "T" can be either "UploadAndConvertContentPart", "EditableContentPart",
 * 			   "UploadContentPart", or "ExternalUrlContentPart"
 * @param {[]} contentParts - The array of content parts to filter, each with a "type" property.
 * @param {string} type - The type of content parts to filter by (example: "UploadAndConvertContentPart")
 * @returns {T[]} - returns an array of content parts matching the specified type, cast to "T".
 */
export function fetchAndMapContentParts<T>(
	contentParts: [],
	type: string
): T[] {
	return contentParts
		.filter((part) => part["type"] === type)
		.map((part) => part as T);
}
