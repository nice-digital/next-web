import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import {
	ProductPageHeading,
	type ProductPageHeadingProps,
} from "@/components/ProductPageHeading/ProductPageHeading";
import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
import { PublicationsDownloadLink } from "@/components/PublicationsDownloadLink/PublicationsDownloadLink";
import { PublicationsPrevNext } from "@/components/PublicationsPrevNext/PublicationsPrevNext";
import {
	getAllIndicatorSubTypes,
	ChapterHeading,
} from "@/feeds/publications/publications";
import {
	ProductDetail,
	ProductGroup,
	type IndicatorSubType,
} from "@/feeds/publications/types";
import { getChapterLinks, validateRouteParams } from "@/utils/product";
import { getPublicationPdfDownloadPath } from "@/utils/url";

import styles from "./index.page.module.scss";

export type IndicatorsDetailsPageProps = {
	product: ProductPageHeadingProps["product"] &
		Pick<ProductDetail, "metaDescription" | "indicatorSubTypeList" | "summary">;
	indicatorSubTypes: IndicatorSubType[];
	pdfDownloadPath: string | null;
	chapters: ChapterHeading[];
};

export default function IndicatorsDetailsPage({
	product,
	indicatorSubTypes,
	pdfDownloadPath,
	chapters,
}: IndicatorsDetailsPageProps): JSX.Element {
	const hasLeftColumn = pdfDownloadPath || chapters.length > 0;

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

			<ProductPageHeading product={product} />

			<Grid gutter="loose">
				{hasLeftColumn ? (
					<GridItem
						cols={12}
						md={4}
						lg={3}
						elementType="section"
						aria-label="Chapters"
					>
						<PublicationsDownloadLink
							ariaLabel="Download indicator PDF file"
							downloadLink={pdfDownloadPath}
						>
							Download indicator
						</PublicationsDownloadLink>

						<PublicationsChapterMenu
							ariaLabel="Chapter pages"
							chapters={chapters}
						/>
					</GridItem>
				) : null}

				<GridItem
					cols={12}
					md={hasLeftColumn ? 8 : 12}
					lg={hasLeftColumn ? 9 : 12}
					elementType="section"
				>
					{product.summary ? (
						<div
							dangerouslySetInnerHTML={{ __html: product.summary }}
							className={styles.summary}
						/>
					) : null}
					<PublicationsPrevNext chapters={chapters} />
				</GridItem>
			</Grid>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	IndicatorsDetailsPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const { product } = result,
		indicatorSubTypes = await getAllIndicatorSubTypes(),
		chapters = getChapterLinks(product),
		pdfDownloadPath = getPublicationPdfDownloadPath(
			product,
			ProductGroup.Other
		);

	const {
		id,
		indicatorSubTypeList,
		lastMajorModificationDate,
		metaDescription,
		productTypeName,
		publishedDate,
		summary,
		title,
	} = product;

	return {
		props: {
			product: {
				// Don't bloat the serialized JSON with all the response data: just pick the fields we need
				id,
				indicatorSubTypeList,
				lastMajorModificationDate,
				metaDescription,
				productTypeName,
				publishedDate,
				summary,
				title,
			},
			indicatorSubTypes,
			pdfDownloadPath,
			chapters,
		},
	};
};
