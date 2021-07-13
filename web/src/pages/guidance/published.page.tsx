import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import dayjs from "dayjs";
import { inPlaceSort } from "fast-sort";

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
				<p key={Name}>{Name}</p>
			))}
			<h2>Areas of interest</h2>
			{areasOfInterest.map(({ Name }) => (
				<p key={Name}>{Name}</p>
			))}
			<h2>Products</h2>
			{products.map(
				({ Title, Id, LastMajorModificationDate, PublishedDate }) => (
					<div key={Title}>
						<h3>
							{Title} ({Id})
						</h3>
						<p>
							<br />
							Last modified:{" "}
							{dayjs(LastMajorModificationDate).format("DD MMM YYYY")}
							<br />
							Published: {dayjs(PublishedDate).format("DD MMM YYYY")}
						</p>
					</div>
				)
			)}
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

/**
 * Returns a a sortable date with just year, month and date (without time).
 * We never expose times to users so it makes sense to just sort by date instead.
 *
 * @param isoDateStr The full date string with timezone e.g. `2021-05-21T10:54:52.4655487`
 * @returns The sortable date, without the timezone e.g. `2021-05-21`
 */
const stripTime = (isoDateStr: string) =>
	isoDateStr.substring(0, isoDateStr.indexOf("T"));
