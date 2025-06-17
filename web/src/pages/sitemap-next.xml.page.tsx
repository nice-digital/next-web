import { ISbStoriesParams } from "@storyblok/react";
import { NextApiResponse } from "next";

import { type SBLink } from "@/types/SBLink";
import { fetchLinks } from "@/utils/storyblok";

const pathsToExclude = ["/authors", "/news/in-depth/"];

function generateSiteMap(links: SBLink[]) {
	const filteredLinks = links.filter(item => !item.is_folder);

	return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	 ${filteredLinks
				.map(({ real_path }) => {
					// Storyblok Links API won't let us supply any params to exclude
					// certain results, so we have to weed them out here instead
					// e.g. we don't want to see any authors
					if (pathsToExclude.some((p) => real_path.includes(p))) {
						return null;
					} else {
						return `
<url>
	<loc>https://www.nice.org.uk${`${real_path}`}</loc>
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
	const nextWebSections = ["news", "careers", "library-and-knowledge-services"];
	const links: SBLink[] = [];

	for (const section of nextWebSections) {
		const sbParams: ISbStoriesParams = {
			starts_with: section,
		};
		links.push(...(await fetchLinks(sbParams)));
	}

	const sitemap = generateSiteMap(links);
	res.setHeader("Content-Type", "text/xml");
	res.write(sitemap);
	res.end();
	return {
		props: {},
	};
}

export default SiteMap;
