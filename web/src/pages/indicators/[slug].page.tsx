import slugify from "@sindresorhus/slugify";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { destination } from "pino";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import { PrevNext } from "@nice-digital/nds-prev-next";

import { Link } from "@/components/Link/Link";
import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
import { SkipLink } from "@/components/SkipLink/SkipLink";
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
	summary: string | undefined,
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

	const router = useRouter();

	let chapters;

	if (product.chapterHeadings) {
		chapters = chaptersAndLinks(
			product.summary,
			product.chapterHeadings,
			productType.identifierPrefix,
			slug
		);
	}

	//TODO calculate current, previous and next chapters for prevnext component
	const nextPageLink = chapters?.[1];

	return (
		<>
			{/* TODO get meta description from api */}
			<NextSeo
				title={
					product.title + " | Standards and Indicators | Indicators | NICE"
				}
				// noindex={}
				// description={metaDescription}
			/>
			{/* TODO acquire & render breadcrumbs correctly - useMemo? */}
			{breadcrumbs()}
			<PageHeader
				heading={product.title}
				useAltHeading
				id="content-start"
				lead={
					<>
						<span>{productType.name} | </span>
						<span>{product.id} </span>
						{product.publishedDate ? (
							<span>
								| Published:{" "}
								<time dateTime={product.publishedDate}>
									{formatDateStr(product.publishedDate)}
								</time>
							</span>
						) : null}

						{product.lastUpdatedDate ? (
							<span>
								Last updated:
								<time dateTime={product.lastUpdatedDate}>
									{" "}
									| {formatDateStr(product.lastUpdatedDate)}{" "}
								</time>
							</span>
						) : null}
					</>
				}
			/>
			{/* TODO render piped subheading correctly - existing NDS component? */}
			<Grid gutter="loose">
				<GridItem
					cols={12}
					md={4}
					lg={3}
					// className={styles.panelWrapper}
					elementType="section"
					// aria-label=""
				>
					{chapters ? <PublicationsChapterMenu chapters={chapters} /> : null}
				</GridItem>
				<GridItem
					cols={12}
					md={8}
					lg={9}
					elementType="section"
					// aria-labelledby=""
				>
					{product.summary ? (
						<div
							dangerouslySetInnerHTML={{ __html: product.summary }}
							className={styles.summary}
						/>
					) : null}
					{/* TODO populate next-prev destinations dynamically */}
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

	//TODO consider early return when there is no product;

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
