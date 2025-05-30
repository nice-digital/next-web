import { type GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";

import { Breadcrumb, Breadcrumbs } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import { EndorsingOrganisations } from "@/components/EndorsingOrganisations/EndorsingOrganisations";
import { LogosList } from "@/components/LogosList/LogosList";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import {
	ProductPageHeading,
	type ProductPageHeadingProps,
} from "@/components/ProductPageHeading/ProductPageHeading";
import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
import { PublicationsDownloadLink } from "@/components/PublicationsDownloadLink/PublicationsDownloadLink";
import { PublicationsPrevNext } from "@/components/PublicationsPrevNext/PublicationsPrevNext";
import { RelatedProducts } from "@/components/RelatedProducts/RelatedProducts";
import { SupportingOrganisations } from "@/components/SupportingOrganisations/SupportingOrganisations";
import {
	ChapterHeading,
	getAllIndicatorSubTypes,
} from "@/feeds/publications/publications";
import {
	ProductDetail,
	type IndicatorSubType,
} from "@/feeds/publications/types";
import { getChapterLinks, validateRouteParams } from "@/utils/product";

import styles from "./index.page.module.scss";

export type IndicatorsDetailsPageProps = {
	productPath: string;
	product: ProductPageHeadingProps["product"] &
		Pick<
			ProductDetail,
			| "metaDescription"
			| "indicatorSubTypeList"
			| "summary"
			| "productStatus"
			| "withdrawnNotes"
			| "supportingList"
			| "endorsementList"
			| "additionalAuthorList"
			| "accreditationList"
			| "productTypeName"
			| "relatedProductList"
		>;
	indicatorSubTypes: IndicatorSubType[];
	pdfDownloadPath: string | null;
	chapters: ChapterHeading[];
	hasEvidenceResources: boolean;
	hasInfoForPublicResources: boolean;
	hasToolsAndResources: boolean;
	hasHistory: boolean;
};

export default function IndicatorsDetailsPage({
	productPath,
	product,
	indicatorSubTypes,
	pdfDownloadPath,
	chapters,
	hasEvidenceResources,
	hasInfoForPublicResources,
	hasToolsAndResources,
	hasHistory,
}: IndicatorsDetailsPageProps): JSX.Element {
	const hasLeftColumn = pdfDownloadPath || chapters.length > 0;
	const isFullyWithdrawn = product.productStatus === "Withdrawn";
	const isTempWithdrawn = product.productStatus === "TemporarilyWithdrawn";
	const relatedqs = product.relatedProductList?.filter(
		(relatedProduct) =>
			relatedProduct.id.toLowerCase().startsWith("qs") &&
			relatedProduct.relationship === "IsTheBasisOf"
	);
	const hasRelatedProduct = relatedqs?.length && relatedqs.length > 0;

	return (
		<>
			<NextSeo
				title={product.title + " | Indicators"}
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
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb>{product.id}</Breadcrumb>
			</Breadcrumbs>

			<ProductPageHeading product={product} />

			<ProductHorizontalNav
				productTypeName="Indicator"
				productPath={productPath}
				hasEvidenceResources={hasEvidenceResources}
				hasToolsAndResources={hasToolsAndResources}
				hasInfoForPublicResources={hasInfoForPublicResources}
				hasHistory={hasHistory}
				isWithdrawn={isFullyWithdrawn || isTempWithdrawn}
			/>

			<Grid gutter="loose">
				{hasLeftColumn ? (
					<GridItem
						cols={12}
						sm={5}
						md={3}
						elementType={"section"}
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
					sm={hasLeftColumn ? 7 : 12}
					md={hasLeftColumn ? 9 : 12}
					elementType={"section"}
				>
					<Grid gutter="loose">
						<GridItem cols={12} md={8}>
							{product.summary ? (
								<div
									dangerouslySetInnerHTML={{ __html: product.summary }}
									className={styles.summary}
								/>
							) : isTempWithdrawn ? (
								<div
									dangerouslySetInnerHTML={{
										__html: product.withdrawnNotes,
									}}
									className={styles.summary}
								/>
							) : null}

							<EndorsingOrganisations
								endorsingList={product.endorsementList}
								productTypeName={product.productTypeName}
							/>
							<SupportingOrganisations
								supportingList={product.supportingList}
								productTypeName={product.productTypeName}
							/>

							<LogosList
								logosList={product.additionalAuthorList}
								productId={product.id}
								logoType="author"
							/>

							<LogosList
								logosList={product.accreditationList}
								productId={product.id}
								logoType="accreditation"
							/>
						</GridItem>

						{hasRelatedProduct ? (
							<GridItem cols={12} md={4}>
								<RelatedProducts relatedProducts={relatedqs} />
							</GridItem>
						) : null}

						<GridItem cols={12}>
							<PublicationsPrevNext chapters={chapters} />
						</GridItem>
					</Grid>
				</GridItem>
			</Grid>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	IndicatorsDetailsPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl, query }) => {
	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const {
			product,
			productType,
			productPath,
			pdfDownloadPath,
			hasEvidenceResources,
			hasInfoForPublicResources,
			hasToolsAndResources,
			hasHistory,
		} = result,
		indicatorSubTypes = await getAllIndicatorSubTypes(),
		chapters = getChapterLinks(product, productType.group);

	return {
		props: {
			productPath,
			hasEvidenceResources,
			hasInfoForPublicResources,
			hasToolsAndResources,
			hasHistory,
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
				withdrawnNotes: product.withdrawnNotes,
				supportingList: product.supportingList,
				endorsementList: product.endorsementList,
				additionalAuthorList: product.additionalAuthorList,
				authorList: product.authorList,
				accreditationList: product.accreditationList,
				relatedProductList: product.relatedProductList,
			},
			indicatorSubTypes,
			pdfDownloadPath,
			chapters,
		},
	};
};
