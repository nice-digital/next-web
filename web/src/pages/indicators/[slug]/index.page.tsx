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
	getAllIndicatorSubTypes,
	getProductDetail,
	isErrorResponse,
	ProductChapter,
	ProductDetail,
	ProductGroup,
} from "@/feeds/publications/publications";
import {
	HTMLChapterContentInfo,
	IndicatorSubType,
} from "@/feeds/publications/types";
import { formatDateStr, getProductPath } from "@/utils";

import styles from "./index.page.module.scss";

export const slugifyFunction = slugify;

const chaptersAndLinks = (
	summary: string | null,
	chapters: HTMLChapterContentInfo[],
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
			url: `/indicators/${slug}/chapters/${chapter.chapterSlug}`,
		});
	});

	return chaptersAndLinksArray;
};

export type IndicatorsDetailsPageProps = {
	slug: string;
	product: ProductDetail;
	indicatorSubTypes: IndicatorSubType[];
};

export default function IndicatorsDetailsPage({
	product,
	slug,
	indicatorSubTypes,
}: IndicatorsDetailsPageProps): JSX.Element {
	let chapters;

	const chapterContentInfo =
		product.embedded.nicePublicationsContentPartList.embedded
			.nicePublicationsUploadAndConvertContentPart.embedded
			.nicePublicationsHtmlContent.embedded
			.nicePublicationsHtmlChapterContentInfo;

	if (chapterContentInfo) {
		chapters = chaptersAndLinks(product.summary, chapterContentInfo, slug);
	}

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
					{
						rel: "schema.DCTERMS",
						href: "http://purl.org/dc/terms/",
					},
				]}
				additionalMetaTags={[
					{
						name: "DCTERMS.subject",
						content: "TODO",
					},
					{
						name: "DCTERMS.issued",
						content: product.publishedDate,
					},
					{
						name: "DCTERMS.modified",
						content: product.lastMajorModificationDate,
					},
					{
						name: "DCTERMS.identifier",
						content: product.id,
					},
					...product.indicatorSubTypeList
						.map((subType) => ({
							name: "DCTERMS.type",
							content: indicatorSubTypes.find(
								(i) => i.identifierPrefix == subType
							)?.name as string,
							keyOverride: subType,
						}))
						.filter((item) => Boolean(item.content)),
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
					{product.summary ? (
						<div
							dangerouslySetInnerHTML={{ __html: product.summary }}
							className={styles.summary}
						/>
					) : null}
					{chapters && <PublicationsPrevNext chapters={chapters} />}
				</GridItem>
			</Grid>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	IndicatorsDetailsPageProps
> = async ({ params }) => {
	if (
		!params ||
		!params.slug ||
		Array.isArray(params.slug) ||
		!params.slug.includes("-")
	) {
		return { notFound: true };
	}

	const [id, ...rest] = params.slug.split("-");

	const getProduct = getProductDetail(id);

	const getSubTypes = getAllIndicatorSubTypes();

	const [product, indicatorSubTypes] = [await getProduct, await getSubTypes];

	if (
		isErrorResponse(product) ||
		product.id.toLowerCase() !== id.toLowerCase()
	) {
		return { notFound: true };
	}

	const titleExtractedFromSlug = rest.join("-").toLowerCase();

	const slugifiedProductTitle = slugify(product.title);
	if (titleExtractedFromSlug !== slugifiedProductTitle) {
		const redirectUrl = getProductPath({
			...product,
			productGroup: ProductGroup.Other,
		});

		return {
			redirect: {
				destination: redirectUrl,
				permanent: true,
			},
		};
	}

	return {
		props: {
			slug: params.slug,
			product,
			indicatorSubTypes,
		},
	};
};
