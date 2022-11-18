import { GetServerSideProps } from "next/types";

import {
	getFileStream,
	getResourceDetail,
} from "@/feeds/publications/publications";
import { logger } from "@/logger";
import { validateRouteParams } from "@/utils/product";
import { findDownloadable } from "@/utils/resource";
import { getServerSideFile } from "@/utils/response";

// Resource download links are in the form "some-title-123-456.xls"
const resourceDownloadPathRegex =
	/^(?<titleSlug>.*)-(?<resourceUID>\d+)-(?<partUID>\d+).(?<extension>.*)$/;

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

	const { product, toolsAndResources } = result;

	if (!toolsAndResources.length) {
		logger.info(
			`Can't download resource with path ${params.downloadPath} in product ${product.id}: no tools and resources`
		);
		return { notFound: true };
	}

	const match = params.downloadPath.match(resourceDownloadPathRegex);

	if (!match || !match.groups) {
		logger.info(
			`Download path of ${params.downloadPath} in product ${product.id} doesn't match expected format`
		);
		return { notFound: true };
	}

	const { titleSlug, resourceUID, partUID, extension } = match.groups,
		resource = toolsAndResources.find(({ uid }) => uid === Number(resourceUID));

	if (!resource) {
		logger.info(
			`Could not find resource with UID ${resourceUID} in product ${product.id}`
		);
		return { notFound: true };
	}

	const fullResource = await getResourceDetail(resource);

	if (!fullResource) return { notFound: true };

	const file = findDownloadable(fullResource, Number(partUID));

	if (file) {
		const { mimeType, links } = file;

		// TODO redirects, check extension and title

		return getServerSideFile(
			await getFileStream(links.self[0].href),
			res,
			mimeType
		);
	}

	return { notFound: true };
};

export default function ResourceDownload(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to write directly to the response
}
