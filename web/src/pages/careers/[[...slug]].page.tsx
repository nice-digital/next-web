import CorporateContentPageTemplate from "@/components/Storyblok/CorporateContentPage/CorporateContentpage";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";
import { getCorporateContentGssp } from "@/utils/getCorporateContentGssp";

export default function CareersContentPageTemplate(
	props: SlugCatchAllProps
): React.ReactElement {
	return (
		<>
			<CorporateContentPageTemplate {...props} />
		</>
	);
}

export const getServerSideProps = getCorporateContentGssp();
