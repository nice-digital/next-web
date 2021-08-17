export const pagePaths = {
	"published guidance list": "/guidance/published",
	"in consultation guidance list": "/guidance/inconsultation",
	"in developmen guidancet list": "/guidance/indevelopment",
	"proposed guidance list": "/guidance/proposed",
	status: "/status",
} as const;

export type PageName = keyof typeof pagePaths;

export const getPath = (pageName: PageName): string => {
	const path = pagePaths[pageName];

	if (!path) throw `Path for page ${pageName} could not be resolved`;

	return path;
};
