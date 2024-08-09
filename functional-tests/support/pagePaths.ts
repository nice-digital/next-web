export const pagePaths = {
	"published guidance list": "/guidance/published",
	"in consultation guidance list": "/guidance/inconsultation",
	"in development guidance list": "/guidance/indevelopment",
	"awaiting development guidance list": "/guidance/awaiting-development",
	status: "/status",
	"published indicators list": "/indicators/published",
	"IND63 overview":
		"/indicators/ind63-pregnancy-and-neonates-mental-health-at-booking-appointment",
	home: "/",
	"news, blogs and podcasts": "/news",
	"nice newsletters and alerts": "/nice-newsletters-and-alerts",
	"subscribe to NICE news for health and social care":
		"/forms/subscribe-to-nice-news-for-health-and-social-care",
} as const;

export type PageName = keyof typeof pagePaths;

export const getPath = (pageName: PageName): string => {
	const path = pagePaths[pageName];

	if (!path) throw `Path for page ${pageName} could not be resolved`;

	return path;
};
