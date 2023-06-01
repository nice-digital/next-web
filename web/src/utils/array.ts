/**
 * Strongly typed way to convert what might be an array of objects or a single object into an array.
 *
 * Useful for working with publications feed responses as some of the embedded types return an array if there's multiple
 * items or a single object (or undefined).
 *
 * @param maybeArray An instance that might be an array of objects, a single object instance, or undefined
 * @returns An array of objects
 */
export const arrayify = <TElementType>(
	maybeArray: TElementType | TElementType[] | undefined
): TElementType[] =>
	Array.isArray(maybeArray) ? maybeArray : maybeArray ? [maybeArray] : [];

const englishCollator = new Intl.Collator("en", {
	numeric: true,
	sensitivity: "base",
});

/**
 * Used for sorting lists alphabetically on a title field
 */
export const byTitleAlphabetically = <T extends { title: string }>(
	a: T,
	b: T
): number => englishCollator.compare(a.title, b.title);

/**
 * Returns whether the given object is truthy or not but casted to the object's type.
 *
 * This casting allows filtering of types that are potentially falsy:
 *
 * @example
 * 	const list: (SomeType | undefined)[] = []
 * 	someList.filter(isTruthy).map(a: SomeType => {
 *  		// Do something
 *  	})
 * */
export const isTruthy = <TMaybe>(
	maybeT: TMaybe | null | undefined
): maybeT is TMaybe => !!maybeT;
