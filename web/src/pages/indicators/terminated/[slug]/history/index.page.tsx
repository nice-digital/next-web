import { type GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";

import { Breadcrumb, Breadcrumbs } from "@nice-digital/nds-breadcrumbs";

import { GuidanceBreadcrumb } from "@/components/GuidanceBreadcrumb/GuidanceBreadcrumb";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { ResourceList } from "@/components/ResourceList/ResourceList";
import { ProjectDetail } from "@/feeds/inDev/inDev";
import { ProductDetail, ProductTypeAcronym } from "@/feeds/publications/types";
import { TaxonomyBreadcrumb } from "@/feeds/taxonomy/types";
import { arrayify, byTitleAlphabetically } from "@/utils/array";
import {
	redirectWithdrawnProducts,
	validateRouteParams,
} from "@/utils/product";
import {
	getHistoryResourceLink,
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
		| "terminatedDate"
	> &
		Partial<Pick<ProductDetail, "productType">>;
	project: Pick<ProjectDetail, "reference" | "title"> & {
		groups: ResourceGroupViewModel[];
	};
	hasEvidenceResources: boolean;
	hasHistory: boolean;
	taxonomyBreadcrumb: TaxonomyBreadcrumb[];
};

export default function HistoryPage({
	productPath,
	product,
	project,
	hasEvidenceResources,
	hasHistory,
	taxonomyBreadcrumb,
}: HistoryPageProps): JSX.Element {
	const isIndicator = product.productType === ProductTypeAcronym.IND;
	const type = isIndicator ? "indicators" : "guidance";
	const label = isIndicator ? "Indicators" : "NICE guidance";

	return (
		<>
			<NextSeo title={`History | ${product.id} | ${label}`} />

			<GuidanceBreadcrumb
				append={[{ title: "History" }]}
				id={product.id}
				productPath={productPath}
				status="terminated"
				taxonomy={taxonomyBreadcrumb}
				type={type}
			/>

			<ProductPageHeading product={product} />

			<ProductHorizontalNav
				productTypeName={isIndicator ? "Indicator" : "Guidance"}
				productPath={productPath}
				hasEvidenceResources={hasEvidenceResources}
				hasToolsAndResources={false}
				hasInfoForPublicResources={false}
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
		hasHistory,
		taxonomyBreadcrumb,
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
			const { textOnly, title } = resource;

			if (textOnly) {
				currentSubGroup = { title: title, resourceLinks: [] };
				subGroups.push(currentSubGroup);
			} else {
				if (!currentSubGroup) {
					currentSubGroup = { title: panel.title, resourceLinks: [] };
					subGroups.push(currentSubGroup);
				}

				const convertedHtmlAlreadyInArray =
					resource.externalLinks && resource.externalLinks.length > 0
						? false
						: currentSubGroup.resourceLinks.some(
								(resourceLink) =>
									resourceLink.title ===
									resource.title.replace("(pdf)", "").trim()
						  );

				// don't show converted html pdf download docs here
				if (!convertedHtmlAlreadyInArray) {
					currentSubGroup.resourceLinks.push(
						...arrayify(
							getHistoryResourceLink({ resource, panel, productPath, product })
						)
					);
				}
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
			hasHistory,
			product: {
				id: product.id,
				title: product.title,
				productTypeName: product.productTypeName,
				publishedDate: product.publishedDate,
				lastMajorModificationDate: product.lastMajorModificationDate,
				productType: product.productType,
				terminatedDate: product.terminatedDate,
			},
			project: {
				reference: project.reference,
				title: project.title,
				groups,
			},
			taxonomyBreadcrumb,
		},
	};
};
