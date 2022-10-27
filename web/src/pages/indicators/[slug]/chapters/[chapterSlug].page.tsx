import slugify from "@sindresorhus/slugify";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";

import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
import { PublicationsPrevNext } from "@/components/PublicationsPrevNext/PublicationsPrevNext";
import {
	getChapterContent,
	getProductDetail,
	HTMLChapterContent,
	isErrorResponse,
	ProductChapter,
	ProductDetail,
	ProductGroup,
} from "@/feeds/publications/publications";
import { formatDateStr, getProductPath } from "@/utils";

import styles from "./[chapterSlug].page.module.scss";

export const slugifyFunction = slugify;

export type IndicatorChapterPageProps = {
	slug: string;
	product: ProductDetail;
	chapterContent: HTMLChapterContent;
};

const chaptersAndLinks = (
	summary: string | null,
	chapters: ProductChapter[],
	slug: string
): ProductChapter[] => {
	const chaptersAndLinksArray: Array<ProductChapter> = [];

	if (summary) {
		chaptersAndLinksArray.push({
			title: "Overview",
			url: `/indicators/${slug}`,
		});
	}

	chapters.forEach((chapter) => {
		if (summary && chapter.title == "Overview") {
			return;
		}
		return chaptersAndLinksArray.push({
			title: chapter.title,
			url: `/indicators/${slug}/chapters/${chapter.url
				.split("/")
				.pop()
				?.toLowerCase()}`,
		});
	});

	return chaptersAndLinksArray;
};

export default function IndicatorChapterPage({
	chapterContent,
	product,
	slug,
}: IndicatorChapterPageProps): JSX.Element {
	const chapters: ProductChapter[] = chaptersAndLinks(
		product.summary,
		product.chapterHeadings,
		slug
	);

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
				{chapters ? (
					<GridItem
						cols={12}
						md={4}
						lg={3}
						elementType="section"
						aria-label="Chapters"
					>
						<PublicationsChapterMenu
							ariaLabel="Chapter pages"
							chapters={chapters}
						/>
					</GridItem>
				) : null}
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
	IndicatorChapterPageProps
> = async ({ params }) => {
	if (
		!params ||
		!params.slug ||
		Array.isArray(params.slug) ||
		!params.slug.includes("-") ||
		!params.chapterSlug ||
		Array.isArray(params.chapterSlug)
	) {
		return { notFound: true };
	}

	const [id, ...rest] = params.slug.split("-");

	const product = await getProductDetail(id);

	if (
		isErrorResponse(product) ||
		product.id.toLowerCase() !== id.toLowerCase()
	) {
		return { notFound: true };
	}

	const titleExtractedFromSlug = rest.join("-").toLowerCase();

	const slugifiedProductTitle = slugify(product.title);
	if (titleExtractedFromSlug !== slugifiedProductTitle) {
		const redirectUrl =
			getProductPath({
				...product,
				productGroup: ProductGroup.Other,
			}) +
			"/chapters/" +
			params.chapterSlug;

		return {
			redirect: {
				destination: redirectUrl,
				permanent: true,
			},
		};
	}

	const chapter =
		product.embedded.nicePublicationsContentPartList.embedded.nicePublicationsUploadAndConvertContentPart.embedded.nicePublicationsHtmlContent.embedded.nicePublicationsHtmlChapterContentInfo.find(
			(c) => c.chapterSlug === params.chapterSlug
		);

	if (!chapter) {
		return { notFound: true };
	}

	const chapterContent = await getChapterContent(
		chapter?.links.self[0].href as string
	);

	if (isErrorResponse(chapterContent)) {
		return { notFound: true };
	}

	return {
		props: {
			slug: params.slug,
			product,
			chapterContent,
		},
	};
};
