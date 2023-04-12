export const pagePaths = {
	"published guidance list": "/guidance/published",
	"in consultation guidance list": "/guidance/inconsultation",
	"in development guidance list": "/guidance/indevelopment",
	"awaiting development guidance list": "/guidance/awaiting-development",
	status: "/status",
	"published indicators list": "/indicators/published",
} as const;

export type PageName = keyof typeof pagePaths;

export const getPath = (pageName: PageName): string => {
	const path = pagePaths[pageName];

	if (!path) throw `Path for page ${pageName} could not be resolved`;

	return path;
};
