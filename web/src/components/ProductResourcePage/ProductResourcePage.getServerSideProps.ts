import { type GetServerSideProps } from "next";

import {
	type ChapterHeading,
	getChapterContent,
	getResourceDetail,
} from "@/feeds/publications/publications";
import { logger } from "@/logger";
import { arrayify } from "@/utils/array";
import { validateRouteParams } from "@/utils/product";
import { ResourceTypeSlug } from "@/utils/resource";
import { slugify } from "@/utils/url";

import { type ProductPageHeadingProps } from "../ProductPageHeading/ProductPageHeading";

// Resource download links are in the form "IND123-some-title-123-456.xls"
const resourcePathRegex =
	/^(?<partTitleSlug>.*)-(?<resourceUID>\d+)-(?<partUID>\d+)$/;

export type ProductResourcePageProps = {
	productPath: string;
	product: ProductPageHeadingProps["product"];
	hasToolsAndResources: boolean;
	hasInfoForPublicResources: boolean;
	hasEvidenceResources: boolean;
	hasHistory: boolean;
	chapters: ChapterHeading[];
	htmlBody: string;
	title: string;
	lastUpdated: string | null;
	resourceTypeSlug: ResourceTypeSlug;
	resourceDownloadPath: string | null;
	resourceDownloadSizeBytes: number | null;
};

export const getGetServerSidePropsFunc =
	(
		resourceTypeSlug: ResourceTypeSlug
	): GetServerSideProps<
		ProductResourcePageProps,
		{ slug: string; partSlug: string }
	> =>
	async ({ params, resolvedUrl, query }) => {
		if (!params || !params.partSlug) return { notFound: true };

		const result = await validateRouteParams({ params, resolvedUrl, query });

		if ("notFound" in result || "redirect" in result) return result;

		const {
			product,
			productPath,
			toolsAndResources,
			hasToolsAndResources,
			hasInfoForPublicResources,
			infoForPublicResources,
			hasEvidenceResources,
			evidenceResources,
			hasHistory,
		} = result;

		if (!hasToolsAndResources) {
			logger.info(
				`Can't serve resource with url ${resolvedUrl} in product ${product.id}: no tools and resources`
			);

			return { notFound: true };
		}

		const pathRegexMatch = params.partSlug.match(resourcePathRegex);

		if (!pathRegexMatch || !pathRegexMatch.groups) {
			logger.info(
				`Resource part slug of ${params.partSlug} in product ${product.id} doesn't match expected format`
			);
			return { notFound: true };
		}

		const resources =
			resourceTypeSlug === ResourceTypeSlug.ToolsAndResources
				? toolsAndResources
				: resourceTypeSlug === ResourceTypeSlug.Evidence
				? evidenceResources
				: infoForPublicResources;

		const { partTitleSlug, resourceUID, partUID } = pathRegexMatch.groups,
			resource = resources.find(({ uid }) => uid === Number(resourceUID));

		if (!resource) {
			logger.info(
				`Could not find resource with UID ${resourceUID} in product ${product.id}`
			);
			return { notFound: true };
		}

		const fullResource = await getResourceDetail(resource);

		if (!fullResource) {
			logger.warn(
				`Full resource with id ${resourceUID} in product ${product.id} can't be found`
			);
			return { notFound: true };
		}

		let title = "",
			htmlBody = "",
			chapters: ChapterHeading[] = [],
			lastUpdated: string | null = "",
			resourceDownloadPath: string | null = null,
			resourceDownloadSizeBytes: number | null = null;

		const editablePart = arrayify(
			fullResource.embedded.contentPartList?.embedded.editableContentPart
		).find(({ uid }) => uid === Number(partUID));

		if (editablePart) {
			const expectedPartTitleSlug = slugify(editablePart.title);
			if (partTitleSlug !== expectedPartTitleSlug) {
				logger.info(
					`Redirecting from title slug of ${partTitleSlug} to ${expectedPartTitleSlug}`
				);

				return {
					redirect: {
						destination: resolvedUrl.replace(
							partTitleSlug,
							expectedPartTitleSlug
						),
						permanent: true,
					},
				};
			}

			const fullEditablePartContent = await getChapterContent(
				editablePart.embedded.htmlContent.links.self[0].href
			);

			if (!fullEditablePartContent) {
				logger.warn(
					`Could not find editable part HTML for part ${editablePart.uid} in product ${product.id}`
				);
				return { notFound: true };
			}

			title = editablePart.title;
			htmlBody = fullEditablePartContent.content;
			lastUpdated = fullResource.lastMajorModificationDate;
			chapters = []; // Editable content parts are just a single HTML page so don't have chapters
			resourceDownloadPath = editablePart.embedded.pdfFile
				? `${productPath}/downloads/${product.id}-${slugify(
						editablePart.title
				  )}-${fullResource.uid}-${editablePart.uid}.pdf`
				: null;
			resourceDownloadSizeBytes = editablePart.embedded.pdfFile
				? editablePart.embedded.pdfFile.length
				: null;
		} else {
			const convertPart = arrayify(
				fullResource.embedded.contentPartList?.embedded
					.uploadAndConvertContentPart
			).find(({ uid }) => uid === Number(partUID));

			throw Error("Upload and convert resources are not implemented yet");

			// const chapterSections =
			// 	chapterContent.embedded?.htmlChapterSectionInfo &&
			// 	Array.isArray(chapterContent.embedded.htmlChapterSectionInfo)
			// 		? chapterContent.embedded.htmlChapterSectionInfo
			// 		: [];
		}

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
				title,
				htmlBody,
				chapters,
				lastUpdated,
				resourceTypeSlug,
				resourceDownloadPath,
				resourceDownloadSizeBytes,
			},
		};
	};
