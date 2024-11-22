import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { ResourceLinkCard } from "@/components/ResourceLinkCard/ResourceLinkCard";
import { getResourceFileHTML } from "@/feeds/inDev/inDev";
import { ProductDetail } from "@/feeds/publications/types";
import { arrayify } from "@/utils/array";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { getFileTypeNameFromMime } from "@/utils/file";
import { validateRouteParams } from "@/utils/product";
import { ResourceLinkViewModel } from "@/utils/resource";

import styles from "./index.page.module.scss";

export type HistoryHTMLPageProps = {
	productPath: string;
	product: Pick<
		ProductDetail,
		| "id"
		| "title"
		| "productTypeName"
		| "publishedDate"
		| "lastMajorModificationDate"
	>;
	hasEvidenceResources: boolean;
	hasInfoForPublicResources: boolean;
	hasToolsAndResources: boolean;
	hasHistory: boolean;
	resource: {
		resourceFileHTML: string;
		title: string;
	};
	resourceLinks: ResourceLinkViewModel[];
	lastUpdated: string;
};

export default function HistoryHTMLPage({
	productPath,
	product,
	hasEvidenceResources,
	hasInfoForPublicResources,
	hasToolsAndResources,
	hasHistory,
	resource,
	lastUpdated,
	resourceLinks,
}: HistoryHTMLPageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={`${resource.title} | History | ${product.id} | Indicators`}
			/>
			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb to={productPath}>{product.id}</Breadcrumb>
				<Breadcrumb to={`${productPath}/history`}>History</Breadcrumb>
				<Breadcrumb>{resource.title}</Breadcrumb>
			</Breadcrumbs>
			<ProductPageHeading product={product} />
			<ProductHorizontalNav
				productTypeName="Indicator"
				productPath={productPath}
				hasEvidenceResources={hasEvidenceResources}
				hasToolsAndResources={hasToolsAndResources}
				hasInfoForPublicResources={hasInfoForPublicResources}
				hasHistory={hasHistory}
			/>
			<div
				dangerouslySetInnerHTML={{ __html: resource.resourceFileHTML }}
			></div>
			{resourceLinks.length > 0 ? (
				<div className={styles.resourceLinks}>
					<hr className="mb--d" />
					<ul className="list list--unstyled">
						{resourceLinks.map((resourceLink) => (
							<li key={resourceLink.href}>
								<ResourceLinkCard resourceLink={resourceLink} />
							</li>
						))}
					</ul>
				</div>
			) : null}
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
}

export const getServerSideProps: GetServerSideProps<
	HistoryHTMLPageProps,
	{ slug: string; htmlPath: string }
> = async ({ params, resolvedUrl, query }) => {
	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const {
		product,
		productPath,
		hasEvidenceResources,
		hasInfoForPublicResources,
		hasToolsAndResources,
		hasHistory,
		historyPanels,
	} = result;

	const resource = historyPanels
		.flatMap((panel) =>
			arrayify(panel.embedded.niceIndevResourceList.embedded.niceIndevResource)
		)
		.find(
			(resource) =>
				resource.embedded?.niceIndevFile.resourceTitleId === params?.htmlPath &&
				resource.showInDocList
		);

	if (!resource) return { notFound: true };

	const resourceFilePath = resource.embedded.niceIndevFile.links.self[0].href;

	const resourceFileHTML = await getResourceFileHTML(resourceFilePath);

	if (resourceFileHTML == null) return { notFound: true };

	const panel = historyPanels.find((panel) => panel.title === resource.title);

	const resourceLinks: ResourceLinkViewModel[] = panel
		? arrayify(panel.embedded.niceIndevResourceList.embedded.niceIndevResource)
				.filter(
					(resource) => !resource.textOnly && resource.title !== panel.title
				)
				.map((resource) => {
					const { mimeType, length, resourceTitleId, fileName } =
							resource.embedded.niceIndevFile,
						isHTML = mimeType === "text/html",
						fileSize = isHTML ? null : length,
						fileTypeName = isHTML ? null : getFileTypeNameFromMime(mimeType),
						href = isHTML
							? `${productPath}/history/${resourceTitleId}`
							: `${productPath}/history/downloads/${
									product.id
							  }-${resourceTitleId}.${fileName.split(".").slice(-1)[0]}`;

					return {
						title: resource.title,
						href,
						fileTypeName,
						fileSize,
						date: resource.publishedDate,
						type: panel.title,
					};
				})
		: [];

	return {
		props: {
			productPath,
			hasEvidenceResources,
			hasInfoForPublicResources,
			hasToolsAndResources,
			hasHistory,
			product: {
				id: product.id,
				title: product.title,
				productTypeName: product.productTypeName,
				publishedDate: product.publishedDate,
				lastMajorModificationDate: product.lastMajorModificationDate,
			},
			resource: {
				resourceFileHTML,
				title: resource.title,
			},
			resourceLinks,
			lastUpdated: resource.publishedDate,
		},
	};
};
