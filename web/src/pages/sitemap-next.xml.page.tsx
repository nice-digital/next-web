import { startsWith } from "lodash";
import { NextApiResponse } from "next";

import { type SBLink } from "@/types/SBLink";
import { fetchLinks } from "@/utils/storyblok";

function generateSiteMap(links: SBLink[]) {
	return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${links
				.map(({ real_path }) => {
					return `
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
