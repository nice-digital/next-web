import { inPlaceSort } from "fast-sort";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { useCallback } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";

import { GuidanceListNav } from "@/components/GuidanceListNav/GuidanceListNav";
import { ProductCard } from "@/components/ProductCard/ProductCard";
import {
	getAllProductTypes,
	getAllAreasOfInterest,
	getAllProducts,
	AreaOfInterest,
	ProductLite,
	ProductStatus,
	ProductType,
	ProductGroup,
} from "@/feeds/publications/publications";
import { stripTime } from "@/utils";

/**
 * The number of products to show per page, if the user hasn't specified
 */
export const productsPerPageDefault = 10;

interface PublishedGuidancePageProps {
	products: readonly ProductLite[];
	productTypes: readonly ProductType[];
	areasOfInterest: readonly AreaOfInterest[];
	totalProducts: number;
	/** 1-based index of the current page */
	currentPage: number;
	totalPages: number;
	/** The number of products to show per page */
	pageSize: number;
}

export default function Published({
	pageSize,
	currentPage,
	totalProducts,
	totalPages,
	productTypes,
	areasOfInterest,
	products,
}: PublishedGuidancePageProps): JSX.Element {
	const getProductTypeName = useCallback(
		(product: ProductLite) =>
			productTypes.find(
				({ IdentifierPrefix }) => IdentifierPrefix === product.ProductType
			)?.Name,
		[productTypes]
	);

	return (
		<>
			<NextSeo title="Published guidance, quality standards and advice" />

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/guidance">NICE guidance</Breadcrumb>
				<Breadcrumb>
					Published guidance, quality standards and&nbsp;advice
				</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				preheading="Published"
				heading="Guidance, quality standards and&nbsp;advice"
			/>

			<GuidanceListNav />

			<p>
				Showing {products.length} products on page {currentPage} of {totalPages}{" "}
				({totalProducts} products total)
			</p>

			<Grid gutter="loose">
				<GridItem cols={12} md={4} lg={3}>
					<h2>Product types</h2>
					<ul className="list list--unstyled">
						{productTypes.map(({ Name }) => (
							<li key={Name}>{Name}</li>
						))}
					</ul>
					<h2>Areas of interest</h2>
					<ul className="list list--unstyled">
						{areasOfInterest.map(({ Name }) => (
							<li key={Name}>{Name}</li>
						))}
					</ul>
				</GridItem>
				<GridItem cols={12} md={8} lg={9}>
					<h2>Products</h2>
					<ol className="list list--unstyled">
						{products.map((product) => (
							<ProductCard
								key={product.Id}
								product={product}
								productTypeName={getProductTypeName(product)}
							/>
						))}
					</ol>
				</GridItem>
			</Grid>
		</>
	);
}

export const getServerSideProps = async (
	_context: GetServerSidePropsContext
): Promise<{ props: PublishedGuidancePageProps }> => {
	// Retrieve required objects in parallel
	const productsTask = getAllProducts(),
		productTypesTask = getAllProductTypes(),
		areasOfInterestTask = getAllAreasOfInterest();

	// Filter down to only what we need - the raw feed methods just give us everything
	const productTypes = (await productTypesTask).filter(isEnabled),
		areasOfInterest = (await areasOfInterestTask).filter(isEnabled),
		publishedListProducts = (await productsTask).filter(isPublishedListProduct);

	// Exclude times when we're comparing dates because we never show times to users
	inPlaceSort(publishedListProducts).by([
		// We don't use standard modification date as that could just be a small spelling fix.
		{ desc: (u) => stripTime(u.LastMajorModificationDate) },
		{ desc: (u) => stripTime(u.PublishedDate) },
		{ asc: "Title" },
	]);

	const pageSize = Number(_context.query["ps"]) || productsPerPageDefault,
		currentPage = Number(_context.query["pa"]) || 1,
		totalProducts = publishedListProducts.length,
		totalPages = Math.ceil(totalProducts / pageSize),
		products = publishedListProducts.slice(currentPage - 1, pageSize);

	return {
		props: {
			currentPage,
			pageSize,
			totalPages,
			totalProducts,
			products,
			productTypes,
			areasOfInterest,
		},
	};
};

/**
 * Simple function that returns true/false for whether the given object is enabled or not.
 * Used for filtering arrays.
 */
const isEnabled = ({
	Enabled,
}: Pick<ProductType | AreaOfInterest, "Enabled">) => Enabled;

/**
 * Determines whether the given product should appear in the list.
 * The raw feeds give us all products including corporate documents, process guides and withdrawn products.
 *
 * @param product The product to check against
 * @returns Whether the given product should show in the published guidance list
 */
const isPublishedListProduct = (product: ProductLite) =>
	product.ProductStatus == ProductStatus.Published &&
	product.ProductGroup != ProductGroup.Corporate;
