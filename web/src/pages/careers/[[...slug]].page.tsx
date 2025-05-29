import { SlugCatchAllProps } from "@/types/SBCorporateContent";
import { getCorporateContentGssp } from "@/utils/getCorporateContentGssp";

import { CorporateContent } from "@/components/Storyblok/CorporateContent/CorporateContent";

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
