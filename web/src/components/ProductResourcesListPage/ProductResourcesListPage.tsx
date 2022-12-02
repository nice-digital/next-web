import { NextSeo } from "next-seo";
import { type FC } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { ResourceList } from "@/components/ResourceList/ResourceList";
import { ResourceTypeSlug } from "@/utils/resource";

import { type ProductResourcesListPageProps } from "./ProductResourcesListPage.getServerSideProps";

export const ProductResourcesListPage: FC<ProductResourcesListPageProps> = ({
	resourceTypeSlug,
	resourceGroups,
	productPath,
	product,
	hasToolsAndResources,
	hasInfoForPublicResources,
	hasEvidenceResources,
	hasHistory,
}) => {
	const pageTitle =
		resourceTypeSlug === ResourceTypeSlug.ToolsAndResources
			? "Tools and resources"
			: resourceTypeSlug === ResourceTypeSlug.Evidence
			? "Evidence"
			: "Information for the public";

	return (
		<>
			<NextSeo
				title={`${pageTitle} | ${product.id} | Indicators | Standards and Indicators`}
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
				<Breadcrumb>{pageTitle}</Breadcrumb>
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

			<ResourceList title={pageTitle} groups={resourceGroups} />
		</>
	);
};
