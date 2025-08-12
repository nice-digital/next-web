import { ISbStoriesParams } from "@storyblok/react";
import { NextApiResponse } from "next";

import { type SBLink } from "@/types/SBLink";
import { fetchLinks } from "@/utils/storyblok";

const pathsToExclude = ["/authors", "/news/in-depth/"];

function generateSiteMap(filteredLinks: SBLink[]) {
	return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	 ${filteredLinks
			.map(({ real_path }) => {
				// Remove trailing slash (except for root "/") to avoid having redirecting URLs in sitemap
				const trimmedPath =
					real_path !== "/" && real_path.endsWith("/")
						? real_path.slice(0, -1)
						: real_path;

				if (pathsToExclude.some((p) => trimmedPath.includes(p))) {
					return null;
				} else {
					return `
<url>
	<loc>https://www.nice.org.uk${trimmedPath}</loc>
</url>
`;
				}
			})
			.join("")}
   </urlset>
 `;
}

function SiteMap(): void {
	// getServerSideProps sends the actual data to the browser
}

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
	// Update this array as sections are migrated into NextWeb
	const nextWebSections = [
		"about-us",
		"accessibility",
		"careers",
		"contact-us",
		"cookies",
		"events",
		"freedom-of-information",
		"get-involved",
		"guidance",
		"implementing-nice-guidance",
		"library-and-knowledge-services",
		"news",
		"nice-newsletters-and-alerts",
		"patient-safety",
		"position-statements",
		"privacy-notice",
		"rapid-c-19",
		"reusing-our-content",
		"terms-and-conditions",
		"what-nice-does",
	];
	const links: SBLink[] = [];

	for (const section of nextWebSections) {
		const sbParams: ISbStoriesParams = {
			starts_with: section,
		};
		links.push(...(await fetchLinks(sbParams)));
	}

	// Remove folders from links array as only pages should be included in sitemap
	const filteredLinks = links.filter((item) => !item.is_folder);

	const sitemap = generateSiteMap(filteredLinks);
	res.setHeader("Content-Type", "text/xml");
	res.write(sitemap);
	res.end();
	return {
		props: {},
	};
}

export default SiteMap;
