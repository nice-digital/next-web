import { CorporateContent } from "@/components/Storyblok/CorporateContentPage/CorporateContentPage";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";
import { getCorporateContentGssp } from "@/utils/getCorporateContentGssp";

export default function CareersContentPageTemplate(
	props: SlugCatchAllProps
): React.ReactElement {
	return (
		<>
			<CorporateContent {...props} />
		</>
	);
}

export const getServerSideProps = getCorporateContentGssp();
