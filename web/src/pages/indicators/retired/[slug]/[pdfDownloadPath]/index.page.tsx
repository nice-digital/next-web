import { GetServerSideProps } from "next/types";

import {
	getFileStream,
	UploadContentPart,
} from "@/feeds/publications/publications";
import { fetchAndMapContentParts } from "@/utils/contentparts";
import { validateRouteParams } from "@/utils/product";
import { getServerSidePDF } from "@/utils/response";

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	{
		slug: string;
		pdfDownloadPath: string;
	}
> = async ({ res, params, resolvedUrl, query }) => {
	if ((params?.pdfDownloadPath || "").indexOf(".pdf") === -1)
		return { notFound: true };

	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const { product, pdfDownloadPath, actualPath } = result;

	if (!product.contentPartsList?.length) return { notFound: true };

	if (!pdfDownloadPath)
		return {
			notFound: true,
		};

	if (actualPath.localeCompare(pdfDownloadPath, "en", { sensitivity: "base" }))
		return {
			redirect: {
				destination: pdfDownloadPath,
				permanent: true,
			},
		};

	const contentParts = product.contentPartsList;
	const uploadContentPart = fetchAndMapContentParts<UploadContentPart>(
		contentParts,
		"UploadContentPart"
	);
	const part = Array.isArray(uploadContentPart)
		? uploadContentPart[0]
		: uploadContentPart;

	if (!part) return { notFound: true };

	const pdfHref = part.file?.url;

	return getServerSidePDF(await getFileStream(pdfHref), res);
};

export default function PDFDownload(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to write directly to the response
}
