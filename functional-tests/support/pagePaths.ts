export const pagePaths = {
	"published guidance list": "/guidance/published",
	"NG243 overview": "/guidance/NG243",
	"in consultation guidance list": "/guidance/inconsultation",
	"in development guidance list": "/guidance/indevelopment",
	"awaiting development guidance list": "/guidance/awaiting-development",
	"topic selection list": "/guidance/topic-selection",
	status: "/status",
	"published indicators list": "/indicators/published",
	"in consultation indicators list": "/indicators/inconsultation",
	"in development indicators list": "/indicators/indevelopment",
	"IND63 overview":
		"/indicators/ind63-pregnancy-and-neonates-mental-health-at-booking-appointment",
	"IND63 indicator":
		"/indicators/ind63-pregnancy-and-neonates-mental-health-at-booking-appointment/chapter/indicator",
	"IND264 overview":
		"/indicators/ind264-kidney-conditions-ckd-and-blood-pressure-when-acr-70-or-more",
	"IND264 indicator":
		"/indicators/ind264-kidney-conditions-ckd-and-blood-pressure-when-acr-70-or-more/chapter/indicator",
	"IND271 overview":
		"/indicators/ind271-smoking-cessation-success-in-people-with-bipolar-schizophrenia-and-other-psychoses",
	"IND262 overview":
		"/indicators/ind262-kidney-conditions-ckd-and-sglt-2-inhibitors",
	IND10272: "/indicators/indevelopment/gid-ind10272",
	"HUB10001 overview": "/hub/indevelopment/gid-hub10001",
	"HUB10002 overview": "/hub/indevelopment/gid-hub10002",
	"HUB10003 overview": "/hub/indevelopment/gid-hub10003",
	home: "/",
	"news, blogs and podcasts": "/news",
	"blogs 1": "/news/blogs/nextweb-automation-blog-donotuse",
	"news articles 1": "/news/articles/nextweb-automation-news-1-donotuse",
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
