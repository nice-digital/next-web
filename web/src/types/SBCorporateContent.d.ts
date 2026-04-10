import { ExtendedSBLink } from "@/utils/storyblok/contentStructureUtils";

export type PreHeader = string | null;

export type SlugCatchAllSuccessProps = {
	story: ISbStoryData<InfoPageStoryblok | CategoryNavigationStoryblok>;
	breadcrumbs: Breadcrumb[];
	preheader: PreHeader;
	component: string;
	tree: ExtendedSBLink[];
	slug: string;
};

export type SlugCatchAllErrorProps = {
	error: string;
};

export type SlugCatchAllProps =
	| SlugCatchAllSuccessProps
	| SlugCatchAllErrorProps;
