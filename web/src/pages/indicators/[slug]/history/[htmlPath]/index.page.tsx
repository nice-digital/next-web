import { type GetServerSideProps } from "next/types";
import { NextSeo } from "next-seo";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { ConvertedDocument } from "@/components/ConvertedDocument/ConvertedDocument";
import { ProductHorizontalNav } from "@/components/ProductHorizontalNav/ProductHorizontalNav";
import { ProductPageHeading } from "@/components/ProductPageHeading/ProductPageHeading";
import { ResourceLinkCard } from "@/components/ResourceLinkCard/ResourceLinkCard";
import {
	getConvertedDocumentHTML,
	getResourceFileHTML,
} from "@/feeds/inDev/inDev";
import {
	IndevConvertedDocument,
	IndevFile,
	type niceIndevConvertedDocument,
	type niceIndevConvertedDocumentChapter,
	type niceIndevConvertedDocumentSection,
} from "@/feeds/inDev/types";
import { type ProductDetail } from "@/feeds/publications/types";
import { arrayify } from "@/utils/array";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { getFileTypeNameFromMime } from "@/utils/file";
import { validateRouteParams } from "@/utils/product";
import { type ResourceLinkViewModel } from "@/utils/resource";

import styles from "./index.page.module.scss";

export type HistoryHTMLPageProps = {
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
	resourceLinks: ResourceLinkViewModel[];
};

export default function HistoryHTMLPage({
	lastUpdated,
	product,
	productHorizontalNav,
	productPath,
	resource,
	resourceLinks,
}: HistoryHTMLPageProps): JSX.Element {
	const { htmlBody, isConvertedDocument, title } = resource;
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

			{isConvertedDocument ? (
				<ConvertedDocument lastUpdated={lastUpdated} resource={resource} />
			) : (
				<>
					<h2>{title}</h2>

					{htmlBody && (
						<div dangerouslySetInnerHTML={{ __html: htmlBody }}></div>
					)}

					{resourceLinks.length > 0 ? (
						<div className={styles.resourceLinks}>
							<hr className="mb--d" />
							<ul className="list list--unstyled">
								{resourceLinks.map((resourceLink) => (
									<li key={resourceLink.href}>
										<ResourceLinkCard resourceLink={resourceLink} />
									</li>
								))}
							</ul>
						</div>
					) : null}

					{lastUpdated ? (
						<p>
							This page was last updated on{" "}
							<time dateTime={stripTime(lastUpdated)}>
								{formatDateStr(lastUpdated)}
							</time>
						</p>
					) : null}
				</>
			)}
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	HistoryHTMLPageProps,
	{ slug: string; htmlPath: string }
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

	const resource = historyPanels
		.flatMap((panel) =>
			arrayify(panel.embedded.niceIndevResourceList.embedded.niceIndevResource)
		)
		.find((resource) => {
			const indevFile =
				resource.embedded?.niceIndevFile ||
				resource.embedded?.niceIndevConvertedDocument;

			return (
				indevFile?.resourceTitleId === params?.htmlPath &&
				resource.showInDocList
			);
		});

	if (!resource) return { notFound: true };

	const isConvertedDocument = Object.hasOwn(
		resource.embedded,
		"niceIndevConvertedDocument"
	);

	const indevFile = isConvertedDocument
		? resource.embedded.niceIndevConvertedDocument
		: resource.embedded.niceIndevFile;

	if (!indevFile) return { notFound: true };

	const resourceFilePath = indevFile.links.self[0].href;

	let resourceFileHTML = isConvertedDocument
		? await getConvertedDocumentHTML(resourceFilePath)
		: await getResourceFileHTML(resourceFilePath);

	if (resourceFileHTML !== null) {
		resourceFileHTML =
			typeof resourceFileHTML === "string"
				? ({ content: resourceFileHTML } as niceIndevConvertedDocument)
				: resourceFileHTML;
	} else {
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
				.filter(
					(embeddedResource) =>
						!embeddedResource.textOnly && embeddedResource.title !== panel.title
				)
				.map((embeddedResource) => {
					const { embedded, publishedDate, title } = embeddedResource;
					const resourceIsConvertedDocument = Object.hasOwn(
						embedded,
						"niceIndevConvertedDocument"
					);

					let resourceIndevFile;

					if (resourceIsConvertedDocument) {
						resourceIndevFile =
							embedded.niceIndevConvertedDocument as IndevConvertedDocument;
					} else {
						resourceIndevFile = (embedded.niceIndevFile ||
							embedded.niceIndevGeneratedPdf) as IndevFile;
					}

					const mimeType =
						"mimeType" in resourceIndevFile
							? resourceIndevFile.mimeType
							: "text/html";
					const length =
						"length" in resourceIndevFile ? resourceIndevFile.length : 0;
					const fileName =
						"fileName" in resourceIndevFile ? resourceIndevFile.fileName : "";
					const resourceTitleId = resourceIndevFile.resourceTitleId;

					const isHTML = mimeType === "text/html";
					const fileSize = isHTML ? null : length;
					const fileTypeName = isHTML
						? null
						: getFileTypeNameFromMime(mimeType);
					const href = isHTML
						? `${productPath}/history/${resourceTitleId}`
						: `${productPath}/history/downloads/${
								product.id
						  }-${resourceTitleId}.${fileName.split(".").slice(-1)[0]}`;

					return {
						title: title,
						href,
						fileTypeName,
						fileSize,
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
				isConvertedDocument,
				pdfDownloadLink,
				sections: resourceFileHTML.sections,
				title: resource.title,
			},
			resourceLinks,
		},
	};
};
