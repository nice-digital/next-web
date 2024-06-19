import { NextApiResponse } from "next";

import { type SBLink } from "@/types/SBLink";
import { fetchLinks } from "@/utils/storyblok";

function generateSiteMap(links: SBLink[]) {
	return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${links
				.map(({ real_path }) => {
					// Storyblok Links API won't let us supply any params to exclude
					// certain results, so we have to weed them out here instead
					// e.g. we don't want to see any authors
					return real_path.includes("/authors")
						? null
						: `
       <url>
           <loc>https://www.nice.org.uk${`${real_path}`}</loc>
       </url>
     `;
				})
				.join("")}
   </urlset>
 `;
}

function SiteMap(): void {
	// getServerSideProps sends the actual data to the browser
}

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
	// We're only interested in fetching news stories for the first release
	// Eventually this will get everything, once the rest of the stuff goes live
	const links = await fetchLinks("published", "news");
	const sitemap = generateSiteMap(links);
	res.setHeader("Content-Type", "text/xml");
	res.write(sitemap);
	res.end();

	return {
		props: {},
	};
}

export default SiteMap;
