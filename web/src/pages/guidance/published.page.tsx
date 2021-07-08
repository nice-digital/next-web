import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import dayjs from "dayjs";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";
import {
	HorizontalNav,
	HorizontalNavLink,
} from "@nice-digital/nds-horizontal-nav";

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
import { Link } from "@/components/Link/Link";

/**
 * The number of products to show per page, if the user hasn't specified
 */
export const productsPerPageDefault = 10;
// const prefixesThatShouldNotBeFilteredBy = [
// 	ProductPrefix.NG,
// 	ProductPrefix.PIP,
// 	ProductPrefix.PSG,
// 	ProductPrefix.COA,
// 	ProductPrefix.COVT,
// 	ProductPrefix.COVM,
// 	ProductPrefix.LGB,
// ];

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
	return (
		<>
			<NextSeo title="Published guidance, advice and quality standards" />

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/guidance">NICE guidance</Breadcrumb>
				<Breadcrumb>
					Published guidance, advice&nbsp;and quality&nbsp;standards
				</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				preheading="Published"
				heading="Guidance, advice&nbsp;and quality&nbsp;standards"
			/>

			<HorizontalNav>
				<HorizontalNavLink
					destination="/guidance/published"
					isCurrent
					elementType={Link}
				>
					<a>Published</a>
				</HorizontalNavLink>
				<HorizontalNavLink
					destination="/guidance/inconsultation"
					elementType={Link}
				>
					<a>In consultation</a>
				</HorizontalNavLink>
				<HorizontalNavLink
					destination="/guidance/indevelopment"
					elementType={Link}
				>
					<a>In development</a>
				</HorizontalNavLink>
				<HorizontalNavLink destination="/guidance/proposed" elementType={Link}>
					<a>Proposed</a>
				</HorizontalNavLink>
			</HorizontalNav>

			<p>
				Showing {products.length} products on page {currentPage} of {totalPages}{" "}
				({totalProducts} products total)
			</p>
			<h2>Product types</h2>
			{productTypes.map(({ Name }) => (
				<div key={Name}>{Name}</div>
			))}
			<h2>Areas of interest</h2>
			{areasOfInterest.map(({ Name }) => (
				<div key={Name}>{Name}</div>
			))}
			<h2>Products</h2>
			{products.map(({ Title }) => (
				<div key={Title}>{Title}</div>
			))}
		</>
	);
}

export const getServerSideProps = async (
	_context: GetServerSidePropsContext
): Promise<{ props: PublishedGuidancePageProps }> => {
	// Download required assets in parallel
	const productsTask = getAllProducts(),
		productTypesTask = getAllProductTypes(),
		areasOfInterestTask = getAllAreasOfInterest();

	// Filter down to only what we need - the raw feed methods just give us everything
	const productTypes = (await productTypesTask).filter(isEnabled),
		areasOfInterest = (await areasOfInterestTask).filter(isEnabled),
		allPublishedListProducts = (await productsTask)
			.filter(isPublishedListProduct)
			.sort(defaultProductSortComparer);

	const pageSize = Number(_context.query["ps"]) || productsPerPageDefault,
		currentPage = Number(_context.query["pa"]) || 1,
		totalProducts = allPublishedListProducts.length,
		totalPages = Math.ceil(totalProducts / pageSize),
		products = allPublishedListProducts.slice(currentPage - 1, pageSize);

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
const isEnabled = ({ Enabled }: Pick<ProductType, "Enabled">) => Enabled;

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

/** The default sort order for a list of products, in this order:
 * - last major modification date
 * - published date
 * - alphabetical
 * Note: we don't use modification date as that could just be a small spelling fix.
 * Note: we exclude times when we're comaping date because we never show times to users
 */
const defaultProductSortComparer = (a: ProductLite, b: ProductLite) => {
	if (a.LastMajorModificationDate != b.LastMajorModificationDate)
		return dayjs(b.LastMajorModificationDate)
			.startOf("day")
			.diff(dayjs(a.LastMajorModificationDate).startOf("day"));

	if (a.PublishedDate != b.PublishedDate)
		return dayjs(b.PublishedDate)
			.startOf("day")
			.diff(dayjs(a.PublishedDate).startOf("day"));

	return a.Title.localeCompare(b.Title);
};
