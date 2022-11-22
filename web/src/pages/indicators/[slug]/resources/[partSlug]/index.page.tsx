import { type GetServerSideProps } from "next";
import { NextSeo } from "next-seo";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import {
	ProductPageHeading,
	type ProductPageHeadingProps,
} from "@/components/ProductPageHeading/ProductPageHeading";
import {
	ChapterHeading,
	getChapterContent,
	getResourceDetail,
} from "@/feeds/publications/publications";
import { logger } from "@/logger";
import { arrayify } from "@/utils/array";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { validateRouteParams } from "@/utils/product";
import { slugify } from "@/utils/url";

// Resource download links are in the form "IND123-some-title-123-456.xls"
const resourcePathRegex =
	/^(?<partTitleSlug>.*)-(?<resourceUID>\d+)-(?<partUID>\d+)$/;

export type ResourcePartPageProps = {
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
};

export default function ({
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
}: ResourcePartPageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={`${title} | Tools and resources | ${product.id} | Indicators | Standards and Indicators`}
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
				<Breadcrumb to={productPath + "/resources"} elementType={Link}>
					Tools and resources
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
}

export const getServerSideProps: GetServerSideProps<
	ResourcePartPageProps,
	{ slug: string; partSlug: string }
> = async ({ params, resolvedUrl, query }) => {
	if (!params || !params.partSlug) return { notFound: true };

	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const {
		product,
		productPath,
		toolsAndResources,
		hasToolsAndResources,
		hasInfoForPublicResources,
		hasEvidenceResources,
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

	const { partTitleSlug, resourceUID, partUID } = pathRegexMatch.groups,
		resource = toolsAndResources.find(({ uid }) => uid === Number(resourceUID));

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
		lastUpdated: string | null = "";

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
		chapters = [];
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
		},
	};
};
