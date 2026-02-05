import { type GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";

import { Breadcrumb, Breadcrumbs } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";

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
	product: ProductPageHeadingProps["product"] &
		Pick<
			ProductDetail,
			"metaDescription" | "indicatorSubTypeList" | "summary" | "productStatus"
		>;
	guidanceOrIndicatorBreadcrumb: {
		label: string;
		slug: string;
		url: string;
	};
	indicatorSubTypes: IndicatorSubType[];
	pdfDownloadPath: string | null;
};

export default function RetiredDetailsPage({
	product,
	guidanceOrIndicatorBreadcrumb,
	indicatorSubTypes,
	pdfDownloadPath,
}: RetiredDetailsPageProps): JSX.Element {
	const { label, slug, url } = guidanceOrIndicatorBreadcrumb,
		indicatorText = slug === "/indicators" ? "indicator" : "",
		pdfFileText =
			(indicatorText !== "" ? indicatorText + " " : "") + "PDF file";

	return (
		<>
			<NextSeo
				title={product.title + " | " + label}
				description={product.metaDescription}
				additionalLinkTags={[
					{
						rel: "sitemap",
						type: "application/xml",
						href: `${slug}/sitemap.xml`,
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
				<Breadcrumb to={url}>{label}</Breadcrumb>
				<Breadcrumb>{product.id}</Breadcrumb>
			</Breadcrumbs>

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
						ariaLabel={`Download retired ${pdfFileText}`}
						downloadLink={pdfDownloadPath}
						className={styles.downloadButton}
					>
						Download retired {indicatorText}
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

	const { product, pdfDownloadPath } = result;
	const isIndicator = product.productType === ProductTypeAcronym.IND;
	const guidanceOrIndicatorBreadcrumb = {
		label: isIndicator ? "Indicators" : "NICE guidance",
		slug: isIndicator ? "/indicators" : "/guidance",
		url: isIndicator ? "/standards-and-indicators/indicators" : "/guidance",
	};
	const indicatorSubTypes = await getAllIndicatorSubTypes();

	return {
		props: {
			product: {
				id: product.id,
				lastMajorModificationDate: product.lastMajorModificationDate,
				productTypeName: product.productTypeName,
				publishedDate: product.publishedDate,
				title: product.title,
				indicatorSubTypeList: product.indicatorSubTypeList,
				metaDescription: product.metaDescription,
				summary: product.summary,
				productStatus: product.productStatus,
			},
			guidanceOrIndicatorBreadcrumb,
			indicatorSubTypes,
			pdfDownloadPath,
		},
	};
};
