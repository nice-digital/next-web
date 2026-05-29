import { type GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";

import { Grid, GridItem } from "@nice-digital/nds-grid";

import { GuidanceBreadcrumb } from "@/components/GuidanceBreadcrumb/GuidanceBreadcrumb";
import {
	ProductPageHeading,
	type ProductPageHeadingProps,
} from "@/components/ProductPageHeading/ProductPageHeading";
import { PublicationsDownloadLink } from "@/components/PublicationsDownloadLink/PublicationsDownloadLink";
import { getAllIndicatorSubTypes } from "@/feeds/publications/publications";
import {
	ProductDetail,
	ProductTypeAcronym,
	type IndicatorSubType,
} from "@/feeds/publications/types";
import { validateRouteParams } from "@/utils/product";

import styles from "./index.page.module.scss";

export type RetiredDetailsPageProps = {
	indicatorSubTypes: IndicatorSubType[];
	pdfDownloadPath: string | null;
	product: ProductPageHeadingProps["product"] &
		Pick<
			ProductDetail,
			| "metaDescription"
			| "indicatorSubTypeList"
			| "summary"
			| "productStatus"
			| "productType"
		>;
	productPath: string;
};

export default function RetiredDetailsPage({
	indicatorSubTypes,
	pdfDownloadPath,
	product,
	productPath,
}: RetiredDetailsPageProps): JSX.Element {
	const isIndicator = product.productType === ProductTypeAcronym.IND;
	const type = isIndicator ? "indicators" : "guidance";
	const label = isIndicator ? "Indicators" : "NICE guidance";
	const downloadButtonText =
		type === "indicators" ? `retired indicator` : "retired";

	return (
		<>
			<NextSeo
				title={product.title + " | " + label}
				description={product.metaDescription}
				additionalLinkTags={[
					{
						rel: "sitemap",
						type: "application/xml",
						href: `/${type}/sitemap.xml`,
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

			{/* retired doesn't use taxonomy, so no props passed in */}
			<GuidanceBreadcrumb
				id={product.id}
				productPath={productPath}
				type={type}
			/>

			<ProductPageHeading product={product} />

			<hr className={styles.hrCustomTab} />

			<Grid gutter="loose">
				<GridItem
					cols={12}
					sm={5}
					md={3}
					elementType={"section"}
					aria-label="Chapters"
				>
					<PublicationsDownloadLink
						ariaLabel={`Download ${downloadButtonText} PDF file`}
						downloadLink={pdfDownloadPath}
						className={styles.downloadButton}
					>
						Download {downloadButtonText}
					</PublicationsDownloadLink>
				</GridItem>

				<GridItem cols={12} sm={7} md={9} elementType={"section"}>
					{product.summary && (
						<div
							dangerouslySetInnerHTML={{ __html: product.summary }}
							className={styles.summary}
						/>
					)}
				</GridItem>
			</Grid>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	RetiredDetailsPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl, query }) => {
	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const { pdfDownloadPath, product, productPath } = result;
	const indicatorSubTypes = await getAllIndicatorSubTypes();

	return {
		props: {
			indicatorSubTypes,
			pdfDownloadPath,
			product: {
				id: product.id,
				lastMajorModificationDate: product.lastMajorModificationDate,
				productType: product.productType,
				productTypeName: product.productTypeName,
				publishedDate: product.publishedDate,
				title: product.title,
				indicatorSubTypeList: product.indicatorSubTypeList,
				metaDescription: product.metaDescription,
				summary: product.summary,
				productStatus: product.productStatus,
			},
			productPath,
		},
	};
};
