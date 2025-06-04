import { GetServerSidePropsContext } from "next/types";

import { CorporateContentPage } from "@/components/Storyblok/CorporateContentPage/CorporateContentPage";
import { SlugCatchAllProps } from "@/types/SBCorporateContent";

const CorporateContentPageSharedTemplate = (
	props: SlugCatchAllProps
): React.ReactElement => {
	return <CorporateContentPage {...props} />;
};

export const getServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	// import of ggssp function is deferred until runtime so the enableRootCatchAll feature flag can be mocked in unit tests that use @/config (runtime safe pattern)
	const { getCorporateContentGssp } = await import(
		"@/utils/getCorporateContentGssp"
	);
	return getCorporateContentGssp()(context);
};

export default CorporateContentPageSharedTemplate;
