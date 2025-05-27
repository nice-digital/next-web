import CorporateContentPageTemplate from "@/components/Storyblok/CorporateContentPage/CorporateContentpage";
import { getCorporateContentGssp } from "@/utils/getCorporateContentGssp";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";

export default function GetInvolvedContentPage(props: SlugCatchAllProps)  {
	return (
		<>
		<h1>Get Involved route catch all</h1>
		<CorporateContentPageTemplate {...props} />
		</>
	);
}

export const getServerSideProps = getCorporateContentGssp("get-involved");
