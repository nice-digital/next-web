const { publicRuntimeConfig } = require("@/config");
const config = require("config");
const siteUrl = publicRuntimeConfig.publicBaseURL; //TODO check if public.[public]BaseURL can be used in all envs (needs deploying to check); octo var removed in https://nicedigital.atlassian.net/browse/NXT-375

/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl,
	generateIndexSitemap: false,
	generateRobotsTxt: false,
	sitemapBaseFileName: "sitemap-0",
	exclude: ["/guidance/errortest", "/status", "/search", "/sitemap-next.xml"],
	transform: (config, loc) => ({
		// Strip out changefreq, priority, lastmod etc:
		// we either don't need them or don't know what the values are
		loc,
	}),
	robotsTxtOptions: {
		additionalSitemaps: [`${siteUrl}/indicators/sitemap.xml`],
	},
};
