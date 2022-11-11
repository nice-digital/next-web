import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import { Link } from "@/components/Link/Link";
import {
	ProductPageHeading,
	type ProductPageHeadingProps,
} from "@/components/ProductPageHeading/ProductPageHeading";
import {
	ProductGroup,
	RelatedResource,
	ResourceGroupType,
	ResourceType,
	Status,
} from "@/feeds/publications/types";
import { validateRouteParams } from "@/utils/product";
import { getProductPath } from "@/utils/url";

export type IndicatorToolsAndResourcesPageProps = {
	resources: RelatedResource[];
	productPath: string;
	product: ProductPageHeadingProps["product"];
};

export default function ({
	resources,
	productPath,
	product,
}: IndicatorToolsAndResourcesPageProps): JSX.Element {
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
				<Breadcrumb>Tools and resources</Breadcrumb>
			</Breadcrumbs>

			<ProductPageHeading product={product} />

			{resources.map((resource) => (
				<div>{resource.title}</div>
			))}
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	IndicatorToolsAndResourcesPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const { product } = result;

	const productPath = getProductPath({
		...product,
		productGroup: ProductGroup.Other,
	});

	const {
		id,
		lastMajorModificationDate,
		productTypeName,
		publishedDate,
		title,
	} = product;

	const allResources =
		product.embedded.relatedResourceList?.embedded.relatedResource || [];

	// TODO tidy this up
	const resourceArray = Array.isArray(allResources)
		? allResources
		: [allResources];

	const filteredResources = resourceArray.filter(
		(r) =>
			r.status === Status.Published &&
			// Evidence and IFPs show on their own, separate pages so exclude those resources here
			r.embedded.resourceGroupList.embedded.resourceGroup.name !==
				ResourceGroupType.Evidence &&
			r.embedded.resourceGroupList.embedded.resourceGroup.name !==
				ResourceGroupType.InformationForThePublic
	);

	// TODO group the resources into 'panels'

	return {
		props: {
			resources: filteredResources,
			productPath,
			product: {
				id,
				lastMajorModificationDate,
				productTypeName,
				publishedDate,
				title,
			},
		},
	};
};
