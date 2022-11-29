import { NextSeo } from "next-seo";
import { FC } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { FileSize } from "@/components/FileSize/FileSize";
import { Link } from "@/components/Link/Link";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { ResourceTypeSlug } from "@/utils/resource";

import { type ProductResourcePageProps } from "./ProductResourcePage.getServerSideProps";

export { type ProductResourcePageProps } from "./ProductResourcePage.getServerSideProps";

export const ProductResourcePage: FC<ProductResourcePageProps> = ({
	productPath,
	product,
	hasToolsAndResources,
	hasInfoForPublicResources,
	hasEvidenceResources,
	hasHistory,
	chapters,
	htmlBody,
	title,
	lastUpdated,
	resourceTypeSlug,
	resourceDownloadPath,
	resourceDownloadSizeBytes,
}) => {
	const parentPageTitle =
		resourceTypeSlug === ResourceTypeSlug.ToolsAndResources
			? "Tools and resources"
			: resourceTypeSlug === ResourceTypeSlug.Evidence
			? "Evidence"
			: "Information for the public";

	return (
		<>
			<NextSeo
				title={`${title} | ${parentPageTitle} | ${product.id} | Indicators | Standards and Indicators`}
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
				<Breadcrumb
					to={productPath + "/" + resourceTypeSlug}
					elementType={Link}
				>
					{parentPageTitle}
				</Breadcrumb>
				<Breadcrumb>{title}</Breadcrumb>
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

			<h2>{title}</h2>

			{resourceDownloadPath ? (
				<p>
					<a href={resourceDownloadPath}>
						Download (PDF
						{resourceDownloadSizeBytes ? (
							<>
								, <FileSize fileSizeBytes={resourceDownloadSizeBytes} />
							</>
						) : null}
						)
					</a>
				</p>
			) : null}

			<div dangerouslySetInnerHTML={{ __html: htmlBody }} />

			{lastUpdated ? (
				<p>
					This page was last updated on{" "}
					<time dateTime={stripTime(lastUpdated)}>
						{formatDateStr(lastUpdated)}
					</time>
				</p>
			) : null}
		</>
	);
};
