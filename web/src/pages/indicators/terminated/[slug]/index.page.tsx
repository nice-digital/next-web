import { type GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";

import { Grid, GridItem } from "@nice-digital/nds-grid";

import { EndorsingOrganisations } from "@/components/EndorsingOrganisations/EndorsingOrganisations";
import { GuidanceBreadcrumb } from "@/components/GuidanceBreadcrumb/GuidanceBreadcrumb";
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
	ProductTypeAcronym,
	type IndicatorSubType,
} from "@/feeds/publications/types";
import { TaxonomyBreadcrumb } from "@/feeds/taxonomy/types";
import { getChapterLinks, validateRouteParams } from "@/utils/product";

import styles from "./index.page.module.scss";

export type TerminatedDetailsPageProps = {
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
			| "productType"
			| "productTypeName"
			| "relatedProductList"
			| "terminatedDate"
		>;
	indicatorSubTypes: IndicatorSubType[];
	pdfDownloadPath: string | null;
	chapters: ChapterHeading[];
	hasEvidenceResources: boolean;
	hasHistory: boolean;
	taxonomyBreadcrumb: TaxonomyBreadcrumb[];
};

export default function TerminatedDetailsPage({
	productPath,
	product,
	indicatorSubTypes,
	pdfDownloadPath,
	chapters,
	hasEvidenceResources,
	hasHistory,
	taxonomyBreadcrumb,
}: TerminatedDetailsPageProps): JSX.Element {
	const hasLeftColumn = pdfDownloadPath || chapters.length > 0;
	const isFullyWithdrawn = product.productStatus === "Withdrawn";
	const isTempWithdrawn = product.productStatus === "TemporarilyWithdrawn";
	const relatedqs = product.relatedProductList?.filter(
		(relatedProduct) =>
			relatedProduct.id.toLowerCase().startsWith("qs") &&
			relatedProduct.relationship === "IsTheBasisOf"
	);
	const hasRelatedProduct = relatedqs?.length && relatedqs.length > 0;

	const isIndicator = product.productType === ProductTypeAcronym.IND;
	const type = isIndicator ? "indicators" : "guidance";
	const label = isIndicator ? "Indicators" : "NICE guidance";
	const downloadButtonText = type === "indicators" ? type.slice(0, -1) : type;

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

			<GuidanceBreadcrumb
				id={product.id}
				taxonomy={taxonomyBreadcrumb}
				type={type}
			/>

			<ProductPageHeading product={product} />

			<ProductHorizontalNav
				productTypeName={isIndicator ? "Indicator" : "Guidance"}
				productPath={productPath}
				hasEvidenceResources={hasEvidenceResources}
				hasToolsAndResources={false}
				hasInfoForPublicResources={false}
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
							ariaLabel={`Download ${downloadButtonText} PDF file`}
							downloadLink={pdfDownloadPath}
						>
							Download {downloadButtonText}
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
	TerminatedDetailsPageProps,
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
			hasHistory,
			taxonomyBreadcrumb,
		} = result,
		indicatorSubTypes = await getAllIndicatorSubTypes(),
		chapters = getChapterLinks(product, productType.group);

	return {
		props: {
			productPath,
			hasEvidenceResources,
			hasHistory,
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
				withdrawnNotes: product.withdrawnNotes,
				supportingList: product.supportingList,
				endorsementList: product.endorsementList,
				additionalAuthorList: product.additionalAuthorList,
				authorList: product.authorList,
				accreditationList: product.accreditationList,
				relatedProductList: product.relatedProductList,
				terminatedDate: product.terminatedDate,
			},
			indicatorSubTypes,
			pdfDownloadPath,
			chapters,
			taxonomyBreadcrumb,
		},
	};
};
