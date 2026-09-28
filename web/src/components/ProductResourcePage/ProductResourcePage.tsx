import parse from "html-react-parser";
import { NextSeo } from "next-seo";
import { FC } from "react";

import { Alert } from "@nice-digital/nds-alert";
import { Button } from "@nice-digital/nds-button";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import { OnThisPageBasic } from "@/components/OnThisPageBasic/OnThisPageBasic";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
import { PublicationsPrevNext } from "@/components/PublicationsPrevNext/PublicationsPrevNext";
import {
	BreadcrumbStatus,
	ProductTypeAcronym,
} from "@/feeds/publications/types";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { ResourceTypeSlug } from "@/utils/resource";

import { GuidanceBreadcrumb } from "../GuidanceBreadcrumb/GuidanceBreadcrumb";

import { type ProductResourcePageProps } from "./ProductResourcePage.getServerSideProps";
import styles from "./ProductResourcePage.module.scss";

export { type ProductResourcePageProps } from "./ProductResourcePage.getServerSideProps";

export const ProductResourcePage: FC<ProductResourcePageProps> = ({
	productPath,
	product,
	hasToolsAndResources,
	hasInfoForPublicResources,
	hasEvidenceResources,
	hasHistory,
	chapters,
	chapterSections,
	htmlBody,
	title,
	lastUpdated,
	resourceTypeSlug,
	resourceDownloadPath,
	taxonomyBreadcrumb,
}) => {
	const hasChapters = chapters.length > 0,
		hasDownloadButton = !!resourceDownloadPath,
		hasChaptersOrDownloadButton = hasChapters || hasDownloadButton,
		hasOnThisPageMenu = chapterSections.length > 1;

	const parentPageTitle =
		resourceTypeSlug === ResourceTypeSlug.ToolsAndResources
			? "Tools and resources"
			: resourceTypeSlug === ResourceTypeSlug.Evidence
			? "Evidence"
			: "Information for the public";

	const isIndicator = product.productType === ProductTypeAcronym.IND;
	const type = isIndicator ? "indicators" : "guidance";
	const label = isIndicator ? "Indicators" : "NICE guidance";

	const breadcrumbAppend = [
		{ title: parentPageTitle, url: `/${resourceTypeSlug}` },
		{ title },
	];
	const breadcrumbStatus =
		product.productStatus.toLowerCase() as BreadcrumbStatus;

	return (
		<>
			<NextSeo
				title={`${title} | ${parentPageTitle} | ${product.id} | ${label}`}
			/>

			<GuidanceBreadcrumb
				append={breadcrumbAppend}
				id={product.id}
				productPath={productPath}
				status={breadcrumbStatus}
				taxonomy={taxonomyBreadcrumb}
				type={type}
			/>

			<ProductPageHeading product={product} />

			{product.alert ? <Alert type="info">{parse(product.alert)}</Alert> : null}

			<ProductHorizontalNav
				productTypeName={isIndicator ? "Indicator" : "Guidance"}
				productPath={productPath}
				hasToolsAndResources={hasToolsAndResources}
				hasInfoForPublicResources={hasInfoForPublicResources}
				hasEvidenceResources={hasEvidenceResources}
				hasHistory={hasHistory}
			/>

			<Grid gutter="loose">
				{hasChaptersOrDownloadButton ? (
					<GridItem
						cols={12}
						md={4}
						lg={3}
						elementType="section"
						aria-label="Chapters"
					>
						{hasDownloadButton ? (
							<Button
								aria-label="Download PDF"
								className={styles.download}
								target="_blank"
								to={resourceDownloadPath}
								variant="cta"
							>
								Download (PDF)
							</Button>
						) : null}
						{hasChapters ? (
							<PublicationsChapterMenu
								ariaLabel="Chapter pages"
								chapters={chapters}
							/>
						) : null}
					</GridItem>
				) : null}

				<GridItem
					cols={12}
					md={hasChaptersOrDownloadButton ? 8 : 12}
					lg={hasChaptersOrDownloadButton ? 9 : 12}
					elementType="section"
				>
					<h2 className={styles.heading}>{title}</h2>

					{hasOnThisPageMenu ? (
						<div className="hide-print">
							<OnThisPageBasic sections={chapterSections} />
						</div>
					) : null}

					<div dangerouslySetInnerHTML={{ __html: htmlBody }} />
					{lastUpdated ? (
						<p>
							This page was last updated on{" "}
							<time dateTime={stripTime(lastUpdated)}>
								{formatDateStr(lastUpdated)}
							</time>
						</p>
					) : null}
					<PublicationsPrevNext chapters={chapters} />
				</GridItem>
			</Grid>
		</>
	);
};
