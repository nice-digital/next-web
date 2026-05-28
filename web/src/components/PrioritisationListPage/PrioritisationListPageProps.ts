import { SearchResults, SearchUrl } from "@nice-digital/search-client";

export interface ActiveModifier {
	displayName: string;
	toggleUrl: string;
}

export interface PrioritisationListPageProps {
	results: SearchResults;
	activeModifiers: ActiveModifier[];
	searchUrl: SearchUrl;
}
