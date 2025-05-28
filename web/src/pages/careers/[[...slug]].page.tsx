import CorporateContentPageTemplate from "@/components/Storyblok/CorporateContentPage/CorporateContentpage";
import { getCorporateContentGssp } from "@/utils/getCorporateContentGssp";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";


export default function CareersContentPageTemplate(props: SlugCatchAllProps)  {
	return (
		<>
		<h1>Careers route catch all</h1>
		<CorporateContentPageTemplate {...props} />
		</>
	);
}

export const getServerSideProps = getCorporateContentGssp();
