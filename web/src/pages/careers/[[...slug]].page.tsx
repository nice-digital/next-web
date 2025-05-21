import CorporateContentPageTemplate from "@/components/Storyblok/CorporateContentPage/CorporateContentpage";
import { getGetServerSideProps } from "./getGetServerSideProps";
import { ISbStoryData } from "@storyblok/react";
import { CategoryNavigationStoryblok, InfoPageStoryblok } from "@/types/storyblok";
import { Breadcrumb } from "@/types/Breadcrumb";

export type SlugCatchAllSuccessProps = {
	story: ISbStoryData<InfoPageStoryblok | CategoryNavigationStoryblok>;
	breadcrumbs: Breadcrumb[];
	siblingPages?: string[];
	component: string;
};

export type SlugCatchAllErrorProps = {
	error: string;
};

export type SlugCatchAllProps =
	| SlugCatchAllSuccessProps
	| SlugCatchAllErrorProps;



export default function CorporateContentPage(props: SlugCatchAllProps)  {
	return (
		<CorporateContentPageTemplate {...props} />
	);
}

export const getServerSideProps = getGetServerSideProps("careers");
