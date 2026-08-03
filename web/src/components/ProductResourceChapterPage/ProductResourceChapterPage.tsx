import parse from "html-react-parser";
import { NextSeo } from "next-seo";
import { FC } from "react";

import { Alert } from "@nice-digital/nds-alert";
import { Button } from "@nice-digital/nds-button";
import { Grid, GridItem } from "@nice-digital/nds-grid";

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
import { OnThisPageBasic } from "../OnThisPageBasic/OnThisPageBasic";

import { type ProductResourceChapterPageProps } from "./ProductResourceChapterPage.getServerSideProps";
import styles from "./ProductResourceChapterPage.module.scss";

export { type ProductResourceChapterPageProps } from "./ProductResourceChapterPage.getServerSideProps";

export const ProductResourceChapterPage: FC<
	ProductResourceChapterPageProps
> = ({
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
	const hasOnThisPageMenu = chapterSections.length > 1;
	const hasDownloadButton = !!resourceDownloadPath;

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
					<PublicationsChapterMenu
						ariaLabel="Chapter pages"
						chapters={chapters}
					/>
				</GridItem>

				<GridItem cols={12} md={8} lg={9} elementType="section">
					<h2 className={styles.heading}>{title}</h2>

					{hasOnThisPageMenu ? (
						<div>
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
