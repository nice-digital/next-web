import slugify from "@sindresorhus/slugify";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import { PrevNext } from "@nice-digital/nds-prev-next";

import { Link } from "@/components/Link/Link";
import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
import {
	getAllProductTypes,
	getProductDetail,
	isErrorResponse,
	ProductChapter,
	ProductDetail,
	ProductType,
} from "@/feeds/publications/publications";
import { formatDateStr } from "@/utils";

import styles from "./[slug].page.module.scss";

export const slugifyFunction = slugify;

const chaptersAndLinks = (
	summary: string | null,
	chapters: ProductChapter[],
	productType: string,
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

export type IndicatorsDetailsPageProps = {
	slug: string;
	product: ProductDetail;
	productType: ProductType;
};

export default function IndicatorsDetailsPage({
	product,
	productType,
	slug,
}: IndicatorsDetailsPageProps): JSX.Element {
	const breadcrumbs = () => (
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
	);

	let chapters;

	if (product.chapterHeadings) {
		chapters = chaptersAndLinks(
			product.summary,
			product.chapterHeadings,
			productType.identifierPrefix,
			slug
		);
	}

	const nextPageLink = chapters?.[1];

	const metaData = [
		productType.name,
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
	];

	return (
		<>
			<NextSeo
				title={
					product.title + " | Standards and Indicators | Indicators | NICE"
				}
				description={product.metaDescription}
				additionalLinkTags={[
					{
						rel: "sitemap",
						type: "application/xml",
						href: "/indicators/sitemap.xml",
					},
				]}
			/>
			{breadcrumbs()}
			<PageHeader
				heading={product.title}
				useAltHeading
				id="content-start"
				metadata={metaData}
				data-testid="page-header"
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
						<PublicationsChapterMenu chapters={chapters} />
					</GridItem>
				) : null}
				<GridItem cols={12} md={8} lg={9} elementType="section">
					{product.summary ? (
						<div
							dangerouslySetInnerHTML={{ __html: product.summary }}
							className={styles.summary}
						/>
					) : null}
					{nextPageLink ? (
						<PrevNext
							nextPageLink={{
								text: nextPageLink.title,
								destination: nextPageLink.url,
								elementType: ({ children, ...props }) => (
									<Link {...props} scroll={false}>
										{children}
									</Link>
								),
							}}
						/>
					) : null}
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

	const productTypes = await getAllProductTypes();
	const productType = productTypes.find((p) => p.identifierPrefix === "IND");

	if (!productType) {
		throw Error("Indicator product type could not be found");
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
		const redirectUrl = "/indicators/" + id + "-" + slugifiedProductTitle;

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
			productType,
		},
	};
};
