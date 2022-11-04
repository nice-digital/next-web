import { NextSeo } from "next-seo";
import { GetServerSideProps } from "next/types";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";

import { PublicationsChapterMenu } from "@/components/PublicationsChapterMenu/PublicationsChapterMenu";
import { PublicationsDownloadLink } from "@/components/PublicationsDownloadLink/PublicationsDownloadLink";
import { PublicationsPrevNext } from "@/components/PublicationsPrevNext/PublicationsPrevNext";
import {
	getAllIndicatorSubTypes,
	ChapterHeading,
	ProductDetail,
} from "@/feeds/publications/publications";
import {
	ProductGroup,
	type IndicatorSubType,
} from "@/feeds/publications/types";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { getChapterLinks, validateRouteParams } from "@/utils/product";
import { getPublicationPdfDownloadPath } from "@/utils/url";

import styles from "./index.page.module.scss";

export type IndicatorsDetailsPageProps = {
	product: ProductDetail;
	indicatorSubTypes: IndicatorSubType[];
	pdfDownloadPath: string;
	chapters: ChapterHeading[];
};

export default function IndicatorsDetailsPage({
	product: {
		id,
		summary,
		productTypeName,
		publishedDate,
		lastMajorModificationDate,
		title,
		metaDescription,
		indicatorSubTypeList,
	},
	indicatorSubTypes,
	pdfDownloadPath,
	chapters,
}: IndicatorsDetailsPageProps): JSX.Element {
	const metaData = [
		productTypeName,
		id,
		publishedDate ? (
			<>
				Published:
				<time dateTime={stripTime(publishedDate)}>
					&nbsp;{formatDateStr(publishedDate)}
				</time>
			</>
		) : null,
		lastMajorModificationDate != publishedDate ? (
			<>
				Last updated:
				<time dateTime={stripTime(lastMajorModificationDate)}>
					&nbsp;{formatDateStr(lastMajorModificationDate)}
				</time>
			</>
		) : null,
	].filter(Boolean);

	return (
		<>
			<NextSeo
				title={title + " | Indicators | Standards and Indicators"}
				description={metaDescription}
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
						content: publishedDate,
					},
					{
						name: "DCTERMS.modified",
						content: lastMajorModificationDate,
					},
					{
						name: "DCTERMS.identifier",
						content: id,
					},
					...indicatorSubTypeList
						.map((subType) => ({
							name: "DCTERMS.type",
							content: indicatorSubTypes.find(
								(i) => i.identifierPrefix == subType
							)?.name as string,
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
				<Breadcrumb>{id}</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				heading={title}
				useAltHeading
				id="content-start"
				metadata={metaData}
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

				<GridItem cols={12} md={8} lg={9} elementType="section">
					{summary ? (
						<div
							dangerouslySetInnerHTML={{ __html: summary }}
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

	return {
		props: {
			product,
			indicatorSubTypes,
			pdfDownloadPath,
			chapters,
		},
	};
};
