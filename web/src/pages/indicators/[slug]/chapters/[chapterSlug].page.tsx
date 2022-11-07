import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";

import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
import { PublicationsDownloadLink } from "@/components/PublicationsDownloadLink/PublicationsDownloadLink";
import { PublicationsPrevNext } from "@/components/PublicationsPrevNext/PublicationsPrevNext";
import {
	getChapterContent,
	ChapterHTMLContent,
	isErrorResponse,
	ChapterHeading,
	ProductDetail,
	ProductGroup,
} from "@/feeds/publications/publications";
import { formatDateStr } from "@/utils/datetime";
import { getChapterLinks, validateRouteParams } from "@/utils/product";
import { getPublicationPdfDownloadPath } from "@/utils/url";

import styles from "./[chapterSlug].page.module.scss";

export type IndicatorChapterPageProps = {
	product: ProductDetail;
	chapterContent: ChapterHTMLContent;
	pdfDownloadPath: string;
	chapters: ChapterHeading[];
};

export default function IndicatorChapterPage({
	chapterContent,
	product,
	pdfDownloadPath,
	chapters,
}: IndicatorChapterPageProps): JSX.Element {
	const metaData = [
		product.productTypeName,
		product.id,
		product.publishedDate ? (
			<>
				Published:
				<time dateTime={dayjs(product.publishedDate).format("YYYY-MM-DD")}>
					&nbsp;{formatDateStr(product.publishedDate)}
				</time>
			</>
		) : null,
		product.lastMajorModificationDate != product.publishedDate ? (
			<>
				Last updated:
				<time dateTime={dayjs(product.lastModified).format("YYYY-MM-DD")}>
					{" "}
					&nbsp;{formatDateStr(product.lastModified)}
				</time>
			</>
		) : null,
	].filter(Boolean);

	return (
		<>
			<NextSeo
				title={product.title + " | Indicators | Standards and Indicators"}
				description={product.metaDescription}
				additionalLinkTags={[
					{
						rel: "sitemap",
						type: "application/xml",
						href: "/indicators/sitemap.xml",
					},
				]}
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

			<PageHeader
				heading={product.title}
				useAltHeading
				id="content-start"
				metadata={metaData}
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
					<div
						dangerouslySetInnerHTML={{ __html: chapterContent.content }}
						className={styles.chapterContent}
					/>
					<PublicationsPrevNext chapters={chapters} />
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

	const { product } = result,
		chapters = getChapterLinks(product),
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

	const chapter =
		part.embedded.htmlContent.embedded.htmlChapterContentInfo.find(
			(c) => c.chapterSlug === params.chapterSlug
		);

	if (!chapter) return { notFound: true };

	const chapterContent = await getChapterContent(
		chapter?.links.self[0].href as string
	);

	if (isErrorResponse(chapterContent)) return { notFound: true };

	//TODO retrieve in page link titles

	// console.log(
	// 	chapterContent.embedded?.htmlChapterSectionInfo.map((section) => {
	// 		return section.title;
	// 	})
	// );

	return {
		props: {
			product,
			chapters,
			chapterContent,
			pdfDownloadPath,
		},
	};
};
