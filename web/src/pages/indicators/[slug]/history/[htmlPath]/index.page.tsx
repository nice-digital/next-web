import { filesize } from "filesize";
import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Card, type CardMetaDataProps } from "@nice-digital/nds-card";

import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { getResourceFileHTML } from "@/feeds/inDev/inDev";
import { ProductDetail } from "@/feeds/publications/types";
import { arrayify, isTruthy } from "@/utils/array";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { getFileTypeNameFromMime } from "@/utils/file";
import { validateRouteParams } from "@/utils/product";
import {
	ResourceGroupViewModel,
	ResourceSubGroupViewModel,
} from "@/utils/resource";

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
		groups: ResourceGroupViewModel[];
	};
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
}: HistoryHTMLPageProps): JSX.Element {
	const resourceLinks = resource.groups[0].subGroups[0].resourceLinks;

	console.log("PRODUCT ##### ", product);
	return (
		<>
			<NextSeo
				title={
					product.title + " | History | Indicators | Standards and Indicators"
				}
			/>
			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators">
					Standards and Indicators
				</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb to={`/indicators/${product.id}`}>{product.id}</Breadcrumb>
				<Breadcrumb to={`/indicators/${product.id}/history`}>
					History
				</Breadcrumb>
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
				<>
					<hr />
					<ul className="list list--unstyled">
						{resourceLinks.map((resource) => {
							const fileSize =
								resource.fileSize && resource.fileSize > 0
									? filesize(resource.fileSize, {
											round: resource.fileSize > 999999 ? 2 : 0,
									  })
									: null;

							const cardMeta: CardMetaDataProps[] = [
								{
									// Hack because of a bug with the card component rendering a 0 when no metadata
									label: "Type",
									value: resource.title,
									// value: subGroup.title,
								},
								resource.date
									? {
											label: "Date",
											value: (
												<time dateTime={stripTime(resource.date)}>
													{formatDateStr(resource.date)}
												</time>
											),
									  }
									: undefined,
								resource.fileTypeName
									? { label: "File type", value: resource.fileTypeName }
									: undefined,
								resource.fileSize && resource.fileSize > 0
									? {
											label: "File size",
											value: fileSize,
									  }
									: undefined,
							].filter(isTruthy);
							return (
								<li key={resource.href}>
									<Card
										headingText={`${resource.title}${
											resource.fileTypeName
												? ` (${resource.fileTypeName}, ${fileSize})`
												: ""
										}`}
										link={{
											destination: resource.href,
										}}
										metadata={cardMeta}
									/>
								</li>
							);
						})}
					</ul>
				</>
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
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

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

	const groups = historyPanels
		.filter((panel) => panel.title === resource.title)
		.map((panel) => {
			const indevResource =
				panel.embedded.niceIndevResourceList.embedded.niceIndevResource;

			const indevResources = Array.isArray(indevResource)
				? indevResource
				: [indevResource];

			const subGroups: ResourceSubGroupViewModel[] = [];

			let currentSubGroup: ResourceSubGroupViewModel;

			indevResources
				.filter(
					(resource) => !resource.textOnly && resource.title !== panel.title
				)
				.forEach((resource) => {
					if (!currentSubGroup) {
						currentSubGroup = { title: panel.title, resourceLinks: [] };
						subGroups.push(currentSubGroup);
					}

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

					currentSubGroup.resourceLinks.push({
						title: resource.title,
						href,
						fileTypeName,
						fileSize,
						date: resource.publishedDate,
					});
				});

			return {
				title: panel.title,
				subGroups,
			};
		});

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
				groups,
			},
			lastUpdated: resource.publishedDate,
		},
	};
};
