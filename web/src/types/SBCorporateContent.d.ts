import { ExtendedSBLink } from "@/components/Storyblok/StoryblokSectionNav/utils/Utils";

export type SlugCatchAllSuccessProps = {
	story: ISbStoryData<InfoPageStoryblok | CategoryNavigationStoryblok>;
	breadcrumbs: Breadcrumb[];
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
