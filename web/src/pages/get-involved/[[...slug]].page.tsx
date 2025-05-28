import CorporateContentPageTemplate from "@/components/Storyblok/CorporateContentPage/CorporateContentpage";
import { getCorporateContentGssp } from "@/utils/getCorporateContentGssp";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";

export default function GetInvolvedContentPage(props: SlugCatchAllProps)  {
	return (
		<>
		<CorporateContentPageTemplate {...props} />
		</>
	);
}

export const getServerSideProps = getCorporateContentGssp();
