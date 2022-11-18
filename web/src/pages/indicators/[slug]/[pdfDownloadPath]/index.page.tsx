import { GetServerSideProps } from "next/types";

import { getFileStream } from "@/feeds/publications/publications";
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

	const { product, pdfDownloadPath } = result;

	if (!product.embedded.contentPartList) return { notFound: true };

	const actualPath = new URL(
		resolvedUrl,
		`https://anything.com`
	).pathname.toLowerCase();

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

	const { uploadAndConvertContentPart } =
			product.embedded.contentPartList.embedded,
		part = Array.isArray(uploadAndConvertContentPart)
			? uploadAndConvertContentPart[0]
			: uploadAndConvertContentPart;

	if (!part) return { notFound: true };

	const pdfHref = part.embedded.pdfFile.links.self[0].href;

	return getServerSidePDF(await getFileStream(pdfHref), res);
};

export default function PDFDownload(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to write directly to the response
}
