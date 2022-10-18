import slugify from "@sindresorhus/slugify";
import { GetServerSideProps } from "next";
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
	ProductDetail,
	ProductType,
} from "@/feeds/publications/publications";
import { formatDateStr } from "@/utils";

export const slugifyFunction = slugify;

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
			<Breadcrumb to="/indicators">NICE indicators</Breadcrumb>
			<Breadcrumb>some breadcrumb</Breadcrumb>
		</Breadcrumbs>
	);

	return (
		<>
			{/* TODO acquire & render breadcrumbs correctly - useMemo? */}
			{breadcrumbs()}
			<PageHeader
				heading={product.title}
				id="content-start"
				lead={
					<>
						<SkipLink targetId="chapters">Skip to chapters</SkipLink>
					</>
				}
			/>

			{/* TODO render piped subheading correctly - existing NDS component? */}
			<ul className={`list list--piped`}>
				<li>{productType.name}</li>
				<li>{id} </li>
				{product.publishedDate ? (
					<li>
						published: <time>{formatDateStr(product.publishedDate)}</time>
					</li>
				) : null}

				{product.lastUpdatedDate ? (
					<li>
						last updated: <time>{formatDateStr(product.lastUpdatedDate)}</time>
					</li>
				) : null}
			</ul>
			<Grid gutter="loose">
				<GridItem
					cols={12}
					md={4}
					lg={3}
					// className={styles.panelWrapper}
					elementType="section"
					// aria-label=""
				>
					{product.chapterHeadings ? (
						<PublicationsChapterMenu
							chapters={product.chapterHeadings}
							productType={productType.identifierPrefix}
							slug={slug}
						/>
					) : null}
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

					{/* TODO populate next-prev destinations dynamically */}
					<PrevNext
						nextPageLink={{
							text: "To do",
							destination: "/somewhere",
							elementType: ({ children, ...props }) => (
								<Link {...props} scroll={false}>
									{children}
								</Link>
							),
						}}
					/>
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
