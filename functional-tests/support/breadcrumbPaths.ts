export const breadcrumbPaths = {
	"published guidance list": "/guidance/published",
	"in consultation guidance list": "/guidance/inconsultation",
	"in development guidance list": "/guidance/indevelopment",
	"awaiting development guidance list": "/guidance/awaiting-development",
	status: "/status",
	"published indicators list": "/indicators/published",
	"IND63 overview":
		"/indicators/ind63-pregnancy-and-neonates-mental-health-at-booking-appointment",
	Home: "/",
	News: "/news",
	"Newsletters and alerts": "/nice-newsletters-and-alerts",
} as const;

export type breadcrumbName = keyof typeof breadcrumbPaths;

export const breadcrumbPath = (breadcrumbName: breadcrumbName): string => {
	const path = breadcrumbPaths[breadcrumbName];

	if (!path) throw `Path for page ${breadcrumbName} could not be resolved`;

	return path;
};
