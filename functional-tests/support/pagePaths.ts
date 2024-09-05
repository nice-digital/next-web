export const pagePaths = {
	"published guidance list": "/guidance/published",
	"NG243 overview": "/guidance/NG243",
	"in consultation guidance list": "/guidance/inconsultation",
	"in development guidance list": "/guidance/indevelopment",
	// "NG10020 overview": "/guidance/indevelopment/GID-NG10020",
	"awaiting development guidance list": "/guidance/awaiting-development",
	// "QS10037 overview": "/guidance/awaiting-development/GID-QS10037",
	"topic selection list": "/guidance/topic-selection",
	// "HST10024 overview": "/guidance/topic-selection/GID-HST10024",
	status: "/status",
	"published indicators list": "/indicators/published",
	"IND63 overview":
		"/indicators/ind63-pregnancy-and-neonates-mental-health-at-booking-appointment",
	"in consultation indicators list": "/indicators/inconsultation",
	"in development indicators list": "/indicators/indevelopment",
	// "IND10007": "/indicators/indevelopment/gid-ind10007",
	"HUB10000 overview": "/hub/indevelopment/gid-hub10000",
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
