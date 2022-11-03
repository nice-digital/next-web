import { GetServerSideProps } from "next/types";

import { getFileStream, ProductGroup } from "@/feeds/publications/publications";
import { getPublicationPdfDownloadPath } from "@/utils/index";
import { getServerSidePDF } from "@/utils/response-utils";

import { validateRouteParams } from "../indicator-utils";

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	{
		slug: string;
		pdfDownloadPath: string;
	}
> = async ({ res, params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const { product } = result,
		expectedPath = getPublicationPdfDownloadPath(product, ProductGroup.Other),
		actualPath = new URL(
			resolvedUrl,
			`https://anything.com`
		).pathname.toLowerCase();

	if (actualPath.localeCompare(expectedPath, "en", { sensitivity: "base" }))
		return {
			redirect: {
				destination: expectedPath,
				permanent: true,
			},
		};

	const { nicePublicationsUploadAndConvertContentPart: partOrParts } =
			product.embedded.nicePublicationsContentPartList.embedded,
		part = Array.isArray(partOrParts) ? partOrParts[0] : partOrParts;

	if (!part) return { notFound: true };

	const pdfHref = part.embedded.nicePublicationsPdfFile.links.self[0].href;

	return await getServerSidePDF(await getFileStream(pdfHref), res);
};

export default function PDFDownload(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to write directly to the response
}
