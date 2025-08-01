import Head from "next/head";

import {
	default as CorporateContentPage,
	getServerSideProps,
} from "@/shared/CorporateContentSharedPageTemplate";

type CKSEndUserLicenceAgreementPageProps = React.ComponentProps<
	typeof CorporateContentPage
>;

const CKSEndUserLicenceAgreementPage = (
	props: CKSEndUserLicenceAgreementPageProps
): JSX.Element => (
	<>
		<CorporateContentPage {...props} />
		<Head>
			<meta name="robots" content="noindex,nofollow" key="robots" />
		</Head>
	</>
);

export default CKSEndUserLicenceAgreementPage;
export { getServerSideProps };
