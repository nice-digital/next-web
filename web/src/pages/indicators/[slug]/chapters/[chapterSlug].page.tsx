import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import {
	OnThisPage,
	OnThisPageSection,
} from "@/components/OnThisPage/OnThisPage";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import {
	ProductPageHeading,
	type ProductPageHeadingProps,
} from "@/components/ProductPageHeading/ProductPageHeading";
import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
import { PublicationsDownloadLink } from "@/components/PublicationsDownloadLink/PublicationsDownloadLink";
import { PublicationsPrevNext } from "@/components/PublicationsPrevNext/PublicationsPrevNext";
import {
	getChapterContent,
	isErrorResponse,
	ChapterHeading,
	ProductGroup,
} from "@/feeds/publications/publications";
import { arrayify } from "@/utils/array";
import { getChapterLinks, validateRouteParams } from "@/utils/product";
import { getProductPath, getPublicationPdfDownloadPath } from "@/utils/url";

import styles from "./[chapterSlug].page.module.scss";

export type IndicatorChapterPageProps = {
	productPath: string;
	product: ProductPageHeadingProps["product"];
	chapterHTML: string;
	chapterTitle: string;
	pdfDownloadPath: string | null;
	chapters: ChapterHeading[];
	chapterSections: OnThisPageSection[];
	hasToolsAndResources: boolean;
	hasInfoForPublicResources: boolean;
	hasEvidenceResources: boolean;
	hasHistory: boolean;
};

export default function IndicatorChapterPage({
	productPath,
	chapterHTML,
	chapterTitle,
	product,
	pdfDownloadPath,
	chapters,
	chapterSections,
	hasToolsAndResources,
	hasInfoForPublicResources,
	hasEvidenceResources,
	hasHistory,
}: IndicatorChapterPageProps): JSX.Element {
	const hasOnThisPageMenu = chapterSections.length > 1;

	return (
		<>
			<NextSeo
				title={`${chapterTitle} | ${product.id} | Indicators | Standards and Indicators`}
			/>

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators">
					Standards and Indicators
				</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb>{product.id}</Breadcrumb>
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

			<Grid gutter="loose">
				<GridItem
					cols={12}
					md={4}
					lg={3}
					elementType="section"
					aria-label="Chapters"
				>
					<PublicationsDownloadLink
						ariaLabel="Download indicator PDF file"
						downloadLink={pdfDownloadPath}
					>
						Download indicator
					</PublicationsDownloadLink>

					<PublicationsChapterMenu
						ariaLabel="Chapter pages"
						chapters={chapters}
					/>
				</GridItem>

				<GridItem cols={12} md={8} lg={9} elementType="section">
					<Grid reverse gutter="loose">
						{hasOnThisPageMenu ? (
							<GridItem cols={12} md={4} lg={3}>
								<OnThisPage sections={chapterSections} />
							</GridItem>
						) : null}
						<GridItem
							cols={12}
							md={hasOnThisPageMenu ? 8 : 12}
							lg={hasOnThisPageMenu ? 9 : 12}
						>
							<div
								dangerouslySetInnerHTML={{ __html: chapterHTML }}
								className={styles.chapterContent}
							/>
							<PublicationsPrevNext chapters={chapters} />
						</GridItem>
					</Grid>
				</GridItem>
			</Grid>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	IndicatorChapterPageProps,
	{ slug: string; chapterSlug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const {
			product,
			hasEvidenceResources,
			hasInfoForPublicResources,
			hasToolsAndResources,
			hasHistory,
		} = result,
		chapters = getChapterLinks(product),
		productPath = getProductPath({
			...product,
			productGroup: ProductGroup.Other,
		}),
		pdfDownloadPath = getPublicationPdfDownloadPath(
			product,
			ProductGroup.Other
		);

	if (!params || !product.embedded.contentPartList) return { notFound: true };

	const { uploadAndConvertContentPart } =
			product.embedded.contentPartList.embedded,
		part = Array.isArray(uploadAndConvertContentPart)
			? uploadAndConvertContentPart[0]
			: uploadAndConvertContentPart;

	if (!part) return { notFound: true };

	const chapter = arrayify(
		part.embedded.htmlContent.embedded?.htmlChapterContentInfo
	).find((c) => c.chapterSlug === params.chapterSlug);

	if (!chapter) return { notFound: true };

	const chapterContent = await getChapterContent(
		chapter?.links.self[0].href as string
	);

	if (isErrorResponse(chapterContent)) return { notFound: true };

	const chapterSections =
		chapterContent.embedded?.htmlChapterSectionInfo &&
		Array.isArray(chapterContent.embedded.htmlChapterSectionInfo)
			? chapterContent.embedded.htmlChapterSectionInfo
			: [];

	const {
		id,
		indicatorSubTypeList,
		lastMajorModificationDate,
		productTypeName,
		publishedDate,
		title,
	} = product;

	return {
		props: {
			productPath,
			hasEvidenceResources,
			hasInfoForPublicResources,
			hasToolsAndResources,
			hasHistory,
			product: {
				// Don't bloat the serialized JSON with all the response data: just pick the fields we need
				id,
				indicatorSubTypeList,
				lastMajorModificationDate,
				productTypeName,
				publishedDate,
				title,
			},
			chapters,
			chapterHTML: chapterContent.content,
			chapterTitle: chapter.title,
			chapterSections: chapterSections.map(({ chapterSlug, title }) => ({
				slug: chapterSlug,
				title,
			})),
			pdfDownloadPath,
		},
	};
};
