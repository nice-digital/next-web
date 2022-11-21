import { type GetServerSideProps } from "next";
import { NextSeo } from "next-seo";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import {
	ProductPageHeading,
	type ProductPageHeadingProps,
} from "@/components/ProductPageHeading/ProductPageHeading";
import { validateRouteParams } from "@/utils/product";

// Resource download links are in the form "IND123-some-title-123-456.xls"
const resourcePathRegex =
	/^(?<partTitleSlug>.*)-(?<resourceUID>\d+)-(?<partUID>\d+)$/;

export type ResourcePartPageProps = {
	productPath: string;
	product: ProductPageHeadingProps["product"];
	hasToolsAndResources: boolean;
	hasInfoForPublicResources: boolean;
	hasEvidenceResources: boolean;
	hasHistory: boolean;
};

export default function ({
	productPath,
	product,
	hasToolsAndResources,
	hasInfoForPublicResources,
	hasEvidenceResources,
	hasHistory,
}: ResourcePartPageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={`Tools and resources | ${product.id} | Indicators | Standards and Indicators`}
			/>

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators">
					Standards and Indicators
				</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb to={productPath} elementType={Link}>
					{product.id}
				</Breadcrumb>
				<Breadcrumb to={productPath + "/resources"} elementType={Link}>
					Tools and resources
				</Breadcrumb>
				<Breadcrumb>TODO</Breadcrumb>
			</Breadcrumbs>

			<ProductPageHeading product={product} />

			<ProductHorizontalNav
				productTypeName="Indicator"
				productPath={productPath}
				hasToolsAndResources={hasToolsAndResources}
				hasInfoForPublicResources={hasInfoForPublicResources}
				hasEvidenceResources={hasEvidenceResources}
				hasHistory={hasHistory}
			/>

			<h2>TODO</h2>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	ResourcePartPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl, query }) => {
	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	if (!result.hasToolsAndResources) return { notFound: true };

	const {
		product,
		productPath,
		hasToolsAndResources,
		toolsAndResources,
		hasInfoForPublicResources,
		hasEvidenceResources,
		hasHistory,
	} = result;

	// TODO: parse path, find resources (editable/upload and convert)

	return {
		props: {
			hasToolsAndResources,
			hasInfoForPublicResources,
			hasEvidenceResources,
			hasHistory,
			productPath,
			product: {
				id: product.id,
				lastMajorModificationDate: product.lastMajorModificationDate,
				productTypeName: product.productTypeName,
				publishedDate: product.publishedDate,
				title: product.title,
			},
		},
	};
};
