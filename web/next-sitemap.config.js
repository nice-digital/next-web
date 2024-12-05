const isTeamCity = !!process.env.TEAMCITY_VERSION;

const siteUrl = isTeamCity
	? // Note the octopus deploy variable in #{} syntax so we can use each environment's full URL at deploy time
	  "#{NEXT_PUBLIC_BASE_URL}"
	: `${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_PUBLIC_BASE_URL}`;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl,
	generateIndexSitemap: false,
	generateRobotsTxt: false,
	sitemapBaseFileName: "sitemap-0",
	exclude: [
		"/guidance/errortest",
		"/status",
		"/search",
		"/news",
		"/news/*",
		"/sitemap-next.xml",
	],
	transform: (config, loc) => ({
		// Strip out changefreq, priority, lastmod etc:
		// we either don't need them or don't know what the values are
		loc,
	}),
	robotsTxtOptions: {
		additionalSitemaps: [`${siteUrl}/indicators/sitemap.xml`],
	},
};
