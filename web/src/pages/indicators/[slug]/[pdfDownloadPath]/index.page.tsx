import { pipeline } from "stream";
import { promisify } from "util";

import { GetServerSideProps } from "next/types";

import {
	getFileStream,
	getProductDetail,
	isErrorResponse,
	ProductGroup,
} from "@/feeds/publications/publications";
import { getPublicationPdfDownloadPath } from "@/utils/index";

export const getServerSideProps: GetServerSideProps = async ({
	req,
	res,
	params,
}) => {
	if (
		!params ||
		!params.slug ||
		Array.isArray(params.slug) ||
		!params.slug.includes("-") ||
		!params.pdfDownloadPath ||
		Array.isArray(params.pdfDownloadPath)
	) {
		return { notFound: true };
	}

	const id = params.slug.split("-")[0],
		product = await getProductDetail(id);

	if (isErrorResponse(product) || product.id.toLowerCase() !== id.toLowerCase())
		return { notFound: true };

	const pdfDownloadPath = getPublicationPdfDownloadPath(
		product,
		ProductGroup.Other
	);
	if (
		pdfDownloadPath.toLowerCase() !==
		new URL(req.url?.toLowerCase() as string, `https://${req.headers.host}`)
			.pathname
	) {
		return {
			redirect: {
				destination: pdfDownloadPath,
				permanent: true,
			},
		};
	}

	const pdfHref =
		product.embedded.nicePublicationsContentPartList.embedded
			.nicePublicationsUploadAndConvertContentPart.embedded
			.nicePublicationsPdfFile.links.self[0].href;

	const stream = await getFileStream(pdfHref),
		promisePipeline = promisify(pipeline);

	res.setHeader("Content-Type", "application/pdf");
	await promisePipeline(stream, res);

	res.end();

	return { props: {} };
};

export default function PDFDownload(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to write directly to the response
}
