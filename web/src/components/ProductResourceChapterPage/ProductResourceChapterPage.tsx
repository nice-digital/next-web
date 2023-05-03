import { NextSeo } from "next-seo";
import { FC } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import { FileSize } from "@/components/FileSize/FileSize";
import { Link } from "@/components/Link/Link";
import { OnThisPage } from "@/components/OnThisPage/OnThisPage";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
import { PublicationsPrevNext } from "@/components/PublicationsPrevNext/PublicationsPrevNext";
import { formatDateStr, stripTime } from "@/utils/datetime";

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
	resourceTypeName,
	resourceDownloadPath,
	resourceDownloadSizeBytes,
}) => {
	const hasOnThisPageMenu = chapterSections.length > 1;

	return (
		<>
			<NextSeo
				title={`${title} | ${resourceTypeName} | ${product.id} | Indicators | Standards and Indicators`}
			/>

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators">
					Standards and Indicators
				</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb to={productPath} elementType={Link}>
					{product.id}
				</Breadcrumb>
				<Breadcrumb
					to={productPath + "/" + resourceTypeSlug}
					elementType={Link}
				>
					{resourceTypeName}
				</Breadcrumb>
				<Breadcrumb>{title}</Breadcrumb>
			</Breadcrumbs>

			<ProductPageHeading product={product} />

			<ProductHorizontalNav
				productTypeName="Indicator"
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
					<PublicationsChapterMenu
						ariaLabel="Chapter pages"
						chapters={chapters}
					/>
				</GridItem>

				<GridItem cols={12} md={8} lg={9} elementType="section">
					<Grid reverse gutter="loose">
						{hasOnThisPageMenu ? (
							<GridItem cols={12} md={4} lg={3}>
								<OnThisPage sections={chapterSections} />
							</GridItem>
						) : null}
						<GridItem
							cols={12}
							md={hasOnThisPageMenu ? 8 : 12}
							lg={hasOnThisPageMenu ? 9 : 12}
						>
							<h2 className={styles.heading}>{title}</h2>
							{resourceDownloadPath ? (
								<p>
									<a href={resourceDownloadPath}>
										Download (PDF
										{resourceDownloadSizeBytes ? (
											<>
												, <FileSize fileSizeBytes={resourceDownloadSizeBytes} />
											</>
										) : null}
										)
									</a>
								</p>
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
				</GridItem>
			</Grid>
		</>
	);
};
