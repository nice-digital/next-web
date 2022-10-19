import slugify from "@sindresorhus/slugify";
import { GetServerSideProps } from "next";
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

export const slugifyFunction = slugify;

export enum ProductTypePaths {
	IND = "/indicators/",
}

const chaptersAndLinks = (
	summary: string | undefined,
	chapters: ProductChapter[],
	productType: string,
	slug: string
): ProductChapter[] => {
	const chaptersAndLinksArray: Array<ProductChapter> = [];

	const productPath =
		ProductTypePaths[productType as keyof typeof ProductTypePaths];

	if (summary) {
		chaptersAndLinksArray.push({
			title: "Overview",
			url: `${productPath}${slug}`,
		});
	}

	chapters.forEach((chapter) => {
		if (summary && chapter.title == "Overview") {
			return;
		}
		return chaptersAndLinksArray.push({
			title: chapter.title,
			url: `${productPath}${slug}/chapters/${
				chapter.url.toString().toLowerCase().split("/")[3]
			}`,
		});
	});

	return chaptersAndLinksArray;
};

export type IndicatorsDetailsPageProps = {
	slug: string;
	id: string;
	product: ProductDetail;
	productType: ProductType;
};

export default function IndicatorsDetailsPage({
	id,
	product,
	productType,
	slug,
}: IndicatorsDetailsPageProps): JSX.Element {
	const breadcrumbs = () => (
		<Breadcrumbs>
			<Breadcrumb to="/">Home</Breadcrumb>
			<Breadcrumb to="/standards-and-indicators">NICE indicators</Breadcrumb>
			<Breadcrumb to="/indicators">NICE indicators</Breadcrumb>
			{/* TODO make id dynamic in lieu of shortTitles */}
			<Breadcrumb>some breadcrumb : ID</Breadcrumb>
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
	let nextPageLink;

	if (chapters) {
		const currentIndex = chapters.findIndex(
			(element) => element.url === router.asPath
		);
		console.log(currentIndex);
		const next =
			currentIndex < chapters.length &&
			chapters[(currentIndex + 1) % chapters.length];

		if (next) {
			nextPageLink = {
				text: next.title,
				destination: next.url,
			};

			console.log(nextPageLink.text);
			console.log(nextPageLink.destination);
		}
	}

	return (
		<>
			{/* TODO acquire & render breadcrumbs correctly - useMemo? */}
			{breadcrumbs()}
			<PageHeader
				heading={product.title}
				id="content-start"
				lead={
					<>
						<span>{productType.name} | </span>
						<span>{id} </span>
						{product.publishedDate ? (
							<span>
								| published: <time>{formatDateStr(product.publishedDate)}</time>
							</span>
						) : null}

						{product.lastUpdatedDate ? (
							<span>
								last updated:{" "}
								<time> | {formatDateStr(product.lastUpdatedDate)} </time>
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
						<span dangerouslySetInnerHTML={{ __html: product.summary }} />
					) : (
						<p>summary goes here</p>
					)}
				</GridItem>
				<GridItem
					cols={12}
					md={8}
					lg={9}
					elementType="section"
					// aria-labelledby=""
				>
					{/* TODO populate next-prev destinations dynamically */}
					{nextPageLink ? (
						<PrevNext
							nextPageLink={{
								text: nextPageLink.text,
								destination: nextPageLink.destination,
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

	// const lookupProductTypeById = (id: string): string => {
	// 	const productTypes = getAllProductTypes();
	// 	console.log({ productTypes });
	// 	return "product type";
	// };

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
			id,
			product,
			productType,
		},
	};
};
