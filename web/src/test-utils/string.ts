export const normaliseString = (str: string): string => {
	return str.replace(/\s+/g, " ").trim();
};
