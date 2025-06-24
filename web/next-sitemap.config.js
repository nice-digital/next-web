// const config = require("config");
//TODO find out why baseURL is set to localhost in default.yaml - sitemap is generated at build so uses config vars not octo vars
// const siteUrl = `${config.get("public.baseURL")}${config.get(
// 	"public.publicBaseURL"
// )}`;
const siteUrl = "https://www.nice.org.uk"; // Hard coding live domain as there's no need to have sitemaps for test envs

/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl,
	generateIndexSitemap: false,
	generateRobotsTxt: false,
	sitemapBaseFileName: "sitemap-next",
	exclude: [
		"/",
		"/guidance/errortest",
		"/status",
		"/search",
		"/about", // Not live on NextJS yet
		"/about/what-we-do/science-policy-research/research-recommendations", // Not live on NextJS yet
		"/sitemap-next.xml",
		"/indicators/sitemap.xml",
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
