import CorporateContentPageTemplate from "@/components/Storyblok/CorporateContentPage/CorporateContentpage";
import { getCorporateContentGssp } from "@/utils/getCorporateContentGssp";
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



export default function CareersContentPageTemplate(props: SlugCatchAllProps)  {
	return (
		<>
		<h1>Careers route catch all</h1>
		<CorporateContentPageTemplate {...props} />
		</>
	);
}

export const getServerSideProps = getCorporateContentGssp("careers");
