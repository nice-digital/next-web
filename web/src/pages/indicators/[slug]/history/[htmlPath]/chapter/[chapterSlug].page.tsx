import { type GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { ConvertedDocument } from "@/components/ConvertedDocument/ConvertedDocument";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { getConvertedDocumentHTML } from "@/feeds/inDev/inDev";
import {
	IndevFile,
	type niceIndevConvertedDocumentChapter,
	type niceIndevConvertedDocumentSection,
} from "@/feeds/inDev/types";
import { type ProductDetail } from "@/feeds/publications/types";
import { arrayify } from "@/utils/array";
import { getFileTypeNameFromMime } from "@/utils/file";
import { validateRouteParams } from "@/utils/product";
import { type ResourceLinkViewModel } from "@/utils/resource";

export type HistoryChapterHTMLPageProps = {
	lastUpdated: string;
	product: Pick<
		ProductDetail,
		| "id"
		| "title"
		| "productTypeName"
		| "publishedDate"
		| "lastMajorModificationDate"
	>;
	productHorizontalNav: {
		hasEvidenceResources: boolean;
		hasHistory: boolean;
		hasInfoForPublicResources: boolean;
		hasToolsAndResources: boolean;
	};
	productPath: string;
	resource: {
		chapters: niceIndevConvertedDocumentChapter[];
		htmlBody: string;
		isConvertedDocument: boolean;
		pdfDownloadLink: string | null;
		sections?: niceIndevConvertedDocumentSection[];
		title: string;
	};
};

export default function HistoryChaperHTMLPage({
	lastUpdated,
	product,
	productHorizontalNav,
	productPath,
	resource,
}: HistoryChapterHTMLPageProps): JSX.Element {
	const { title } = resource;
	const { id } = product;

	return (
		<>
			<NextSeo title={`${title} | History | ${id} | Indicators`} />

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb to={productPath}>{id}</Breadcrumb>
				<Breadcrumb to={`${productPath}/history`}>History</Breadcrumb>
				<Breadcrumb>{title}</Breadcrumb>
			</Breadcrumbs>

			<ProductPageHeading product={product} />

			<ProductHorizontalNav
				productTypeName="Indicator"
				productPath={productPath}
				{...productHorizontalNav}
			/>

			<ConvertedDocument lastUpdated={lastUpdated} resource={resource} />
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	HistoryChapterHTMLPageProps,
	{ slug: string; htmlPath: string; chapterSlug: string }
> = async ({ params, resolvedUrl, query }) => {
	if (!params || !params.htmlPath) return { notFound: true };

	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const {
		product,
		productPath,
		hasEvidenceResources,
		hasHistory,
		hasInfoForPublicResources,
		hasToolsAndResources,
		historyPanels,
	} = result;

	const chapterSlug =
		(Array.isArray(params.chapterSlug)
			? params.chapterSlug[0]
			: params.chapterSlug) || "";

	const resource = historyPanels
		.flatMap((panel) =>
			arrayify(panel.embedded.niceIndevResourceList.embedded.niceIndevResource)
		)
		.find((resource) => {
			const indevFile = resource.embedded?.niceIndevConvertedDocument;

			return (
				indevFile?.resourceTitleId === params?.htmlPath &&
				resource.showInDocList
			);
		});

	if (!resource) return { notFound: true };

	const indevFile = resource.embedded?.niceIndevConvertedDocument;

	if (!indevFile) return { notFound: true };

	let resourceFilePath = indevFile.links.self[0].href;

	const resourceFilePathHTMLIndex = resourceFilePath.lastIndexOf("/html");

	resourceFilePath =
		resourceFilePathHTMLIndex > -1
			? `${resourceFilePath.slice(
					0,
					resourceFilePathHTMLIndex
			  )}/chapter/${chapterSlug}`
			: resourceFilePath;

	const resourceFileHTML = await getConvertedDocumentHTML(resourceFilePath);

	if (resourceFileHTML === null) {
		return { notFound: true };
	}

	const panel = historyPanels.find((panel) => {
		const indevResource = arrayify(
			panel.embedded.niceIndevResourceList.embedded.niceIndevResource
		);
		return indevResource[0].title === resource.title;
	});

	const resourceLinks: ResourceLinkViewModel[] = panel
		? arrayify(panel.embedded.niceIndevResourceList.embedded.niceIndevResource)
				.filter((embeddedResource) => {
					const { embedded, textOnly, title } = embeddedResource;
					const resourceIsGeneratedPdf = Object.hasOwn(
						embedded,
						"niceIndevGeneratedPdf"
					);

					return !textOnly && title !== panel.title && resourceIsGeneratedPdf;
				})
				.map((embeddedResource) => {
					const { embedded, publishedDate, title } = embeddedResource;

					const resourceIndevFile =
						embedded.niceIndevGeneratedPdf || ({} as IndevFile);
					const resourceIsGeneratedPdf = Object.hasOwn(
						embedded,
						"niceIndevGeneratedPdf"
					);

					if (!resourceIsGeneratedPdf) return false;

					const href = `${productPath}/history/downloads/${product.id}-${
						resourceIndevFile.resourceTitleId
					}.${resourceIndevFile.fileName.split(".").slice(-1)[0]}`;

					return {
						title: title,
						href,
						fileTypeName: getFileTypeNameFromMime(resourceIndevFile.mimeType),
						fileSize: resourceIndevFile.length,
						date: publishedDate,
						type: panel.title,
					};
				})
		: [];

	const pdfDownload = resourceLinks.filter(
		(resourceLink) =>
			resourceLink.fileTypeName === "PDF" &&
			resourceLink.title.replace("(pdf)", "").trim() === resource.title
	);

	const pdfDownloadLink = pdfDownload.length > 0 ? pdfDownload[0].href : null;

	return {
		props: {
			lastUpdated: resource.publishedDate,
			product: {
				id: product.id,
				title: product.title,
				productTypeName: product.productTypeName,
				publishedDate: product.publishedDate,
				lastMajorModificationDate: product.lastMajorModificationDate,
			},
			productHorizontalNav: {
				hasEvidenceResources,
				hasHistory,
				hasInfoForPublicResources,
				hasToolsAndResources,
			},
			productPath,
			resource: {
				chapters: resourceFileHTML.chapters || [],
				htmlBody: resourceFileHTML.content,
				isConvertedDocument: true,
				pdfDownloadLink,
				sections: resourceFileHTML.sections,
				title: resource.title,
			},
		},
	};
};
