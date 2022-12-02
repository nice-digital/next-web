import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import {
	OnThisPage,
	OnThisPageSection,
} from "@/components/OnThisPage/OnThisPage";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { ResourceList } from "@/components/ResourceList/ResourceList";
import { ProjectDetail } from "@/feeds/inDev/inDev";
import { ProductDetail } from "@/feeds/publications/types";
import { arrayify, byTitleAlphabetically } from "@/utils/array";
import { getFileTypeNameFromMime } from "@/utils/file";
import { validateRouteParams } from "@/utils/product";
import {
	ResourceGroupViewModel,
	ResourceSubGroupViewModel,
} from "@/utils/resource";
import { slugify } from "@/utils/url";

export type HistoryPageProps = {
	productPath: string;
	product: Pick<
		ProductDetail,
		| "id"
		| "title"
		| "productTypeName"
		| "publishedDate"
		| "lastMajorModificationDate"
	>;
	project: Pick<ProjectDetail, "reference" | "title"> & {
		groups: ResourceGroupViewModel[];
	};
	hasEvidenceResources: boolean;
	hasInfoForPublicResources: boolean;
	hasToolsAndResources: boolean;
	hasHistory: boolean;
	groupSections: OnThisPageSection[];
};

export default function HistoryPage({
	productPath,
	product,
	project,
	hasEvidenceResources,
	hasInfoForPublicResources,
	hasToolsAndResources,
	hasHistory,
	groupSections,
}: HistoryPageProps): JSX.Element {
	const hasOnThisPageMenu = groupSections.length > 1;

	return (
		<>
			<NextSeo
				title={`History | ${product.id} | Indicators | Standards and Indicators`}
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
				<Breadcrumb>History</Breadcrumb>
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

			<ResourceList title="History" groups={project.groups} />
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	HistoryPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl, query }) => {
	const result = await validateRouteParams({ params, query, resolvedUrl });

	if ("notFound" in result || "redirect" in result) return result;

	const {
		project,
		historyPanels,
		product,
		productPath,
		hasEvidenceResources,
		hasInfoForPublicResources,
		hasToolsAndResources,
		hasHistory,
	} = result;

	if (!project) return { notFound: true };

	if (!hasHistory) return { notFound: true };

	const groups = historyPanels.sort(byTitleAlphabetically).map((panel) => {
		const indevResource =
			panel.embedded.niceIndevResourceList.embedded.niceIndevResource;

		const indevResources = arrayify(indevResource);

		const subGroups: ResourceSubGroupViewModel[] = [];

		let currentSubGroup: ResourceSubGroupViewModel;

		indevResources.forEach((resource) => {
			if (resource.textOnly) {
				currentSubGroup = { title: resource.title, resourceLinks: [] };
				subGroups.push(currentSubGroup);
			} else {
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
					type: panel.title,
				});
			}
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
			project: {
				reference: project.reference,
				title: project.title,
				groups,
			},
			groupSections: groups.map(({ title }, i) => ({
				slug: slugify(title) + i,
				title,
			})),
		},
	};
};
