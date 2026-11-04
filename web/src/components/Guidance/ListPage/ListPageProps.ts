import { SearchResults, SearchUrl } from "@nice-digital/search-client";

export interface ActiveModifier {
	displayName: string;
	toggleUrl: string;
}

export interface ListPageProps {
	results: SearchResults;
	activeModifiers: ActiveModifier[];
	searchUrl: SearchUrl;
	index: string;
}
