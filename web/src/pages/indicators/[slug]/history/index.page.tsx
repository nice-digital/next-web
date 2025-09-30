import { type GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";

import { Breadcrumb, Breadcrumbs } from "@nice-digital/nds-breadcrumbs";

import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { ResourceList } from "@/components/ResourceList/ResourceList";
import { IndevConvertedDocument, IndevFile, ProjectDetail } from "@/feeds/inDev/inDev";
import { ProductDetail } from "@/feeds/publications/types";
import { arrayify, byTitleAlphabetically } from "@/utils/array";
import { getFileTypeNameFromMime } from "@/utils/file";
import {
	redirectWithdrawnProducts,
	validateRouteParams,
} from "@/utils/product";
import {
	ResourceGroupViewModel,
	ResourceSubGroupViewModel,
} from "@/utils/resource";

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
};

export default function HistoryPage({
	productPath,
	product,
	project,
	hasEvidenceResources,
	hasInfoForPublicResources,
	hasToolsAndResources,
	hasHistory,
}: HistoryPageProps): JSX.Element {
	return (
		<>
			<NextSeo title={`History | ${product.id} | Indicators`} />

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
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

			<ResourceList
				title="History"
				lead="Documents created during the development process."
				groups={project.groups}
			/>
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

	const isWithdrawn = redirectWithdrawnProducts(product, productPath);

	if (isWithdrawn) {
		return isWithdrawn;
	}

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

				let indevFile;

				if (resource.embedded?.hasOwnProperty("niceIndevConvertedDocument")) {
					indevFile = resource.embedded?.niceIndevConvertedDocument as IndevConvertedDocument;
				} else {
					indevFile = (resource.embedded?.niceIndevFile || resource?.embedded?.niceIndevGeneratedPdf) as IndevFile;
				}

				const mimeType = "mimeType" in indevFile ? indevFile.mimeType : "text/html";
				const length = "length" in indevFile ? indevFile.length : 0;
				const resourceTitleId = indevFile.resourceTitleId;
				const fileName = "fileName" in indevFile ? indevFile.fileName : "";

				const isHTML = mimeType === "text/html";
				const fileSize = isHTML ? null : length;
				const fileTypeName = isHTML ? null : getFileTypeNameFromMime(mimeType);
				const href = isHTML
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
		},
	};
};
