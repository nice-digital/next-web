import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";

import { Grid, GridItem } from "@nice-digital/nds-grid";

import { GuidanceBreadcrumb } from "@/components/GuidanceBreadcrumb/GuidanceBreadcrumb";
import {
	OnThisPageBasic,
	type OnThisPageBasicSection,
} from "@/components/OnThisPageBasic/OnThisPageBasic";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import {
	ProductPageHeading,
	type ProductPageHeadingProps,
} from "@/components/ProductPageHeading/ProductPageHeading";
import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
import { PublicationsDownloadLink } from "@/components/PublicationsDownloadLink/PublicationsDownloadLink";
import { PublicationsPrevNext } from "@/components/PublicationsPrevNext/PublicationsPrevNext";
import {
	ChapterHeading,
	getChapterContent,
	UploadAndConvertContentPart,
} from "@/feeds/publications/publications";
import { ProductDetail, ProductTypeAcronym } from "@/feeds/publications/types";
import { TaxonomyBreadcrumb } from "@/feeds/taxonomy/types";
import { arrayify } from "@/utils/array";
import { fetchAndMapContentParts } from "@/utils/contentparts";
import {
	getChapterLinks,
	redirectWithdrawnProducts,
	validateRouteParams,
} from "@/utils/product";

//import styles from "./[chapterSlug].page.module.scss";

export type TerminatedChapterPageProps = {
	productPath: string;
	product: ProductPageHeadingProps["product"] &
		Pick<ProductDetail, "productType" | "terminatedDate">;
	chapterHTML: string;
	chapterTitle: string;
	pdfDownloadPath: string | null;
	chapters: ChapterHeading[];
	chapterSections: OnThisPageBasicSection[];
	hasEvidenceResources: boolean;
	hasHistory: boolean;
	taxonomyBreadcrumb: TaxonomyBreadcrumb[];
};

export default function TerminatedChapterPage({
	productPath,
	chapterHTML,
	chapterTitle,
	product,
	pdfDownloadPath,
	chapters,
	chapterSections,
	hasEvidenceResources,
	hasHistory,
	taxonomyBreadcrumb,
}: TerminatedChapterPageProps): JSX.Element {
	const hasOnThisPageMenu = chapterSections.length > 1;

	const isIndicator = product.productType === ProductTypeAcronym.IND;
	const type = isIndicator ? "indicators" : "guidance";
	const label = isIndicator ? "Indicators" : "NICE guidance";
	const downloadButtonText = type === "indicators" ? type.slice(0, -1) : type;

	return (
		<>
			<NextSeo title={`${chapterTitle} | ${product.id} | ${label}`} />

			<GuidanceBreadcrumb
				id={product.id}
				productPath={productPath}
				status="terminated"
				taxonomy={taxonomyBreadcrumb}
				type={type}
			/>

			<ProductPageHeading product={product} />

			<ProductHorizontalNav
				productTypeName={isIndicator ? "Indicator" : "Guidance"}
				productPath={productPath}
				hasToolsAndResources={false}
				hasInfoForPublicResources={false}
				hasEvidenceResources={hasEvidenceResources}
				hasHistory={hasHistory}
			/>

			<Grid gutter="loose">
				<GridItem
					cols={12}
					md={4}
					lg={3}
					elementType="section"
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

				<GridItem cols={12} md={8} lg={9} elementType="section">
					{hasOnThisPageMenu ? (
						<div className="hide-print">
							<OnThisPageBasic sections={chapterSections} />
						</div>
					) : null}

					<div
						dangerouslySetInnerHTML={{ __html: chapterHTML }}
						//className={styles.chapterContent}
					/>
					<PublicationsPrevNext chapters={chapters} />
				</GridItem>
			</Grid>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	TerminatedChapterPageProps,
	{ slug: string; chapterSlug: string }
> = async ({ params, resolvedUrl, query }) => {
	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const {
			product,
			productPath,
			pdfDownloadPath,
			productType,
			hasEvidenceResources,
			hasHistory,
			taxonomyBreadcrumb,
		} = result,
		chapters = getChapterLinks(product, productType.group);

	const isWithdrawn = redirectWithdrawnProducts(product, productPath);

	if (isWithdrawn) {
		return isWithdrawn;
	}

	if (!params || !product.contentPartsList?.length) return { notFound: true };

	const contentParts = product.contentPartsList;

	const uploadAndConvertContentPart =
			fetchAndMapContentParts<UploadAndConvertContentPart>(
				contentParts,
				"UploadAndConvertContentPart"
			),
		part = Array.isArray(uploadAndConvertContentPart)
			? uploadAndConvertContentPart[0]
			: uploadAndConvertContentPart;

	if (!part) return { notFound: true };

	const chapter = arrayify(part.tableOfContents).find(
		(c) => c.chapterSlug === params.chapterSlug
	);

	if (!chapter) return { notFound: true };

	const chapterContent = await getChapterContent(chapter?.url as string);

	if (!chapterContent) return { notFound: true };

	const chapterSections =
		chapterContent.sections && Array.isArray(chapterContent.sections)
			? chapterContent.sections
			: [];

	const {
		id,
		indicatorSubTypeList,
		lastMajorModificationDate,
		productTypeName,
		publishedDate,
		title,
	} = product;

	return {
		props: {
			productPath,
			hasEvidenceResources,
			hasHistory,
			product: {
				// Don't bloat the serialized JSON with all the response data: just pick the fields we need
				id,
				indicatorSubTypeList,
				lastMajorModificationDate,
				productType: product.productType,
				productTypeName,
				publishedDate,
				terminatedDate: product.terminatedDate,
				title,
			},
			chapters,
			chapterHTML: chapterContent.content,
			chapterTitle: chapter.title,
			chapterSections: chapterSections.map(({ chapterSlug, title }) => ({
				slug: chapterSlug,
				title,
			})),
			pdfDownloadPath,
			taxonomyBreadcrumb,
		},
	};
};
