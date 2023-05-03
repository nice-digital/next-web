import { GetServerSideProps } from "next/types";

import { getFileStream } from "@/feeds/inDev/inDev";
import { logger } from "@/logger";
import { arrayify } from "@/utils/array";
import { validateRouteParams } from "@/utils/product";
import { getServerSideFile } from "@/utils/response";

// Resource download links are in the form "IND123-some-title.xls"
const downloadPathRegex =
	/^(?<productID>[A-Za-z]+\d+)-(?<resourceTitleId>.*)\.(?<extension>[^.]+)$/;

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	{
		slug: string;
		downloadPath: string;
	}
> = async ({ res, params, resolvedUrl, query }) => {
	if (!params || !params.downloadPath) return { notFound: true };

	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const { project, product, historyPanels } = result;

	if (!project) {
		logger.info(`Project could not be found for product ${product.id}`);
		return { notFound: true };
	}

	const pathRegexMatch = params.downloadPath.match(downloadPathRegex);

	if (!pathRegexMatch || !pathRegexMatch.groups) {
		logger.info(
			`Download path of ${params.downloadPath} in product ${product.id} doesn't match expected format of [productId]-[resourceTitleId].[extension]`
		);

		return { notFound: true };
	}

	const { productID, resourceTitleId, extension } = pathRegexMatch.groups,
		resource = historyPanels
			.flatMap((panel) =>
				arrayify(
					panel.embedded.niceIndevResourceList.embedded.niceIndevResource
				)
			)
			.find(
				(resource) =>
					resource.embedded?.niceIndevFile.resourceTitleId === resourceTitleId
			);

	if (productID.toLowerCase() !== product.id.toLowerCase()) {
		logger.info(
			`Resource with ID ${resourceTitleId} belongs to product ${product.id} but URL was for product ${productID}`
		);

		return { notFound: true };
	}

	if (!resource) {
		logger.info(
			`Could not find resource with ID ${resourceTitleId} in product ${product.id}`
		);

		return { notFound: true };
	}

	const { fileName, links, mimeType } = resource.embedded.niceIndevFile,
		expectedExtension = fileName.split(".").slice(-1)[0].toLowerCase();

	if (expectedExtension.toLowerCase() !== extension.toLowerCase()) {
		logger.info(
			`Found incorrect extension of ${extension} in resource ${resourceTitleId} in product ${product.id}. Expected extension of ${expectedExtension}`
		);

		return { notFound: true };
	}

	return getServerSideFile(
		await getFileStream(links.self[0].href),
		res,
		mimeType
	);
};

export default function FileDownload(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to write directly to the response
}
