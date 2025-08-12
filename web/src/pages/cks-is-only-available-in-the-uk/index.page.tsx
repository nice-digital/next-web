import Head from "next/head";

import {
	default as CorporateContentPage,
	getServerSideProps,
} from "@/shared/CorporateContentSharedPageTemplate";

type CKSOnlyAvailableInUKPageProps = React.ComponentProps<
	typeof CorporateContentPage
>;

const CKSOnlyAvailableInUKPage = (
	props: CKSOnlyAvailableInUKPageProps
): JSX.Element => (
	<>
		<CorporateContentPage {...props} />
		<Head>
			<meta name="robots" content="noindex,nofollow" key="robots" />
		</Head>
	</>
);

export default CKSOnlyAvailableInUKPage;
export { getServerSideProps };
