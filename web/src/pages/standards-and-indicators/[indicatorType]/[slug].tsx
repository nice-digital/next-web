import { GetServerSideProps } from "next/types";

import {
	getIndicatorMappings,
	getProductDetail,
	ProductGroup,
} from "@/feeds/publications/publications";
import { getProductPath } from "@/utils/url";

export const getServerSideProps: GetServerSideProps = async ({
	resolvedUrl,
}) => {
	const mapping = (await getIndicatorMappings()).find(
		({ url }) => new URL(url).pathname === resolvedUrl
	);

	if (!mapping) return { notFound: true };

	const product = await getProductDetail(mapping.id);

	if (!product) return { notFound: true };

	const newURL = getProductPath({
		...product,
		productGroup: ProductGroup.Other,
	});

	return {
		redirect: {
			destination: newURL,
			permanent: true,
		},
	};
};

export default function OldIndicatorDetailsPage(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to redirect
}
