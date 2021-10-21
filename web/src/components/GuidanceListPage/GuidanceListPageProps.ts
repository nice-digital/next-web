import { SearchResults, SearchUrl } from "@nice-digital/search-client";

export interface ActiveModifier {
	displayName: string;
	toggleUrl: string;
}

export interface GuidanceListPageProps {
	results: SearchResults;
	activeModifiers: ActiveModifier[];
	searchUrl: SearchUrl;
}
