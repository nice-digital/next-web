import { SearchResults, SearchUrl } from "@nice-digital/search-client";

export interface ActiveModifier {
	displayName: string;
	toggleUrl: string;
}

export interface ProductListPageProps {
	results: SearchResults;
	activeModifiers: ActiveModifier[];
	searchUrl: SearchUrl;
}
