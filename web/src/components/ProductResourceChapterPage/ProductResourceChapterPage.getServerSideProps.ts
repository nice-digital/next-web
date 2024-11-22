import { type GetServerSideProps } from "next";

import {
	type ChapterHeading,
	getChapterContent,
	getResourceDetail,
	BaseContentPart,
	UploadAndConvertContentPart,
} from "@/feeds/publications/publications";
import { logger } from "@/logger";
import { arrayify } from "@/utils/array";
import { fetchAndMapContentParts } from "@/utils/contentparts";
import { validateRouteParams } from "@/utils/product";
import { ResourceTypeSlug } from "@/utils/resource";
import { slugify } from "@/utils/url";

import { OnThisPageSection } from "../OnThisPage/OnThisPage";
import { type ProductPageHeadingProps } from "../ProductPageHeading/ProductPageHeading";

// Resource download links are in the form "IND123-some-title-123-456.xls"
const resourcePathRegex =
	/^(?<partTitleSlug>.*)-(?<resourceUID>\d+)-(?<partUID>\d+)$/;

export type ProductResourceChapterPageProps = {
	productPath: string;
	product: ProductPageHeadingProps["product"];
	hasToolsAndResources: boolean;
	hasInfoForPublicResources: boolean;
	hasEvidenceResources: boolean;
	hasHistory: boolean;
	chapters: ChapterHeading[];
	chapterSections: OnThisPageSection[];
	htmlBody: string;
	title: string;
	lastUpdated: string | null;
	resourceTypeSlug: ResourceTypeSlug;
	resourceTypeName: string;
	resourceDownloadPath: string | null;
	resourceDownloadSizeBytes: number | null;
};

export const getGetServerSidePropsFunc =
	(
		resourceTypeSlug: ResourceTypeSlug,
		resourceTypeName: string
	): GetServerSideProps<
		ProductResourceChapterPageProps,
		{ slug: string; partSlug: string; chapterSlug: string }
	> =>
	async ({ params, resolvedUrl, query }) => {
		if (!params || !params.partSlug || !params.chapterSlug)
			return { notFound: true };

		const result = await validateRouteParams({ params, resolvedUrl, query });

		if ("notFound" in result || "redirect" in result) return result;

		const pathRegexMatch = params.partSlug.match(resourcePathRegex);

		if (!pathRegexMatch || !pathRegexMatch.groups) {
			logger.info(
				`Resource part slug of ${params.partSlug} in product ${result.product.id} doesn't match expected format`
			);
			return { notFound: true };
		}

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
			} = result,
			resources =
				resourceTypeSlug === ResourceTypeSlug.ToolsAndResources
					? toolsAndResources
					: resourceTypeSlug === ResourceTypeSlug.Evidence
					? evidenceResources
					: infoForPublicResources,
			{ partTitleSlug, resourceUID, partUID } = pathRegexMatch.groups,
			resource = resources.find(({ uid }) => uid === Number(resourceUID));

		if (!resource) {
			logger.info(
				`Could not find resource with UID ${resourceUID} in product ${product.id}`
			);
			return { notFound: true };
		}

		const fullResource = await getResourceDetail(resource);

		if (!fullResource || !fullResource.contentPartsList) {
			logger.warn(
				`Full resource with id ${resourceUID} in product ${product.id} can't be found`
			);
			return { notFound: true };
		}

		const contentParts = fullResource.contentPartsList;

		const uploadAndConvertContentPart =
				fetchAndMapContentParts<UploadAndConvertContentPart>(
					contentParts,
					"UploadAndConvertContentPart"
				),
			byPartUID = ({ uid }: BaseContentPart) => uid === Number(partUID);

		const convertPart = arrayify(uploadAndConvertContentPart).find(byPartUID);

		if (!convertPart) {
			logger.warn(
				`Couldn't find either an upload and convert part with id ${partUID}`
			);

			return {
				notFound: true,
			};
		}

		const title = convertPart?.title || "",
			expectedPartTitleSlug = slugify(convertPart?.title || "");

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

		const chapterInfos = arrayify(convertPart.tableOfContents),
			currentChapter = chapterInfos.find(
				(c) => c.chapterSlug === params.chapterSlug
			);

		if (!currentChapter) {
			logger.info(
				`Could not find chapter with slug ${params.chapterSlug} in part ${partUID}`
			);

			return {
				notFound: true,
			};
		} else if (currentChapter === chapterInfos[0]) {
			logger.info(
				`Redirecting ${params.chapterSlug} to resource root for ${partUID}`
			);
			return {
				redirect: {
					destination: `${productPath}/${resourceTypeSlug}/${params.partSlug}`,
					permanent: true,
				},
			};
		}

		const currentChapterContent = await getChapterContent(currentChapter.url);

		if (!currentChapterContent)
			throw Error(
				`Could not find chapter part HTML for upload and convert part ${convertPart.uid} in product ${product.id}`
			);

		const htmlBody = currentChapterContent.content;
		const resourceDownloadPath = `${productPath}/downloads/${product.id}-${params.partSlug}.pdf`;
		const resourceDownloadSizeBytes = convertPart.pdf.length;
		const chapters = chapterInfos.map(({ title, chapterSlug }, i) => ({
			title,
			url:
				`${productPath}/${resourceTypeSlug}/${params.partSlug}` +
				(i === 0 ? "" : `/chapter/${chapterSlug}`),
		}));
		const chapterSections = arrayify(currentChapterContent.sections).map(
			(s) => ({
				slug: s.chapterSlug,
				title: s.title,
			})
		);

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
				chapterSections,
				lastUpdated: fullResource.lastMajorModificationDate,
				resourceTypeSlug,
				resourceTypeName,
				resourceDownloadPath,
				resourceDownloadSizeBytes,
			},
		};
	};
