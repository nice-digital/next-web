import { GetServerSideProps } from "next/types";

import {
	getFileStream,
	getResourceDetail,
} from "@/feeds/publications/publications";
import { logger } from "@/logger";
import { validateRouteParams } from "@/utils/product";
import { findDownloadable } from "@/utils/resource";
import { getServerSideFile } from "@/utils/response";
import { slugify } from "@/utils/url";

// Resource download links are in the form "IND123-some-title-123-456.xls"
const resourceDownloadPathRegex =
	/^(?<productID>[A-Za-z]+\d+)-(?<partTitleSlug>.*)-(?<resourceUID>\d+)-(?<partUID>\d+)\.(?<extension>[^.]+)$/;

export type Params = {
	slug: string;
	downloadPath: string;
};

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	Params
> = async ({ res, params, resolvedUrl, query }) => {
	if (!params || !params.downloadPath) return { notFound: true };

	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const {
		product,
		toolsAndResources,
		evidenceResources,
		infoForPublicResources,
	} = result;

	const allResources = [
		...toolsAndResources,
		...evidenceResources,
		...infoForPublicResources,
	];

	if (!allResources.length) {
		logger.info(
			`Can't download resource with path ${params.downloadPath} in product ${product.id}: no resources`
		);
		return { notFound: true };
	}

	const pathRegexMatch = params.downloadPath.match(resourceDownloadPathRegex);

	if (!pathRegexMatch || !pathRegexMatch.groups) {
		logger.info(
			`Download path of ${params.downloadPath} in product ${product.id} doesn't match expected format`
		);
		return { notFound: true };
	}

	const { productID, partTitleSlug, resourceUID, partUID, extension } =
			pathRegexMatch.groups,
		resource = allResources.find(({ uid }) => uid === Number(resourceUID));

	if (productID.toLowerCase() !== product.id.toLowerCase()) {
		logger.info(
			`Resource with UID ${resourceUID} belongs to product ${product.id} but URL was for product ${productID}`
		);
		return { notFound: true };
	}

	if (!resource) {
		logger.info(
			`Could not find resource with UID ${resourceUID} in product ${product.id}`
		);
		return { notFound: true };
	}

	const fullResource = await getResourceDetail(resource);

	if (!fullResource) return { notFound: true };

	const downloadable = findDownloadable(fullResource, Number(partUID));

	if (!downloadable) {
		logger.info(
			`Could not find downloadable part with id ${partUID} in resource ${fullResource.uid} and product ${product.id}`
		);
		return { notFound: true };
	}

	const {
		part,
		file: { mimeType, links, fileName },
	} = downloadable;

	// Check the file extension matches
	const expectedExtension = fileName.split(".").slice(-1)[0].toLowerCase();
	if (expectedExtension.toLowerCase() !== extension.toLowerCase()) {
		logger.info(
			`Found incorrect extension of ${extension} in part ${part.title} (${part.uid}) in product ${product.id}. Expected extension of ${expectedExtension}`
		);
		return { notFound: true };
	}

	// Check the title matches. If it doesn't, we know enough to be able to redirect to the correct place
	const expectedPartTitleSlug = slugify(part.title);
	if (partTitleSlug !== expectedPartTitleSlug) {
		logger.info(
			`Redirecting from title slug of ${partTitleSlug} to ${expectedPartTitleSlug}`
		);

		return {
			redirect: {
				destination: resolvedUrl.replace(partTitleSlug, expectedPartTitleSlug),
				permanent: true,
			},
		};
	}

	return getServerSideFile(
		await getFileStream(links.self[0].href),
		res,
		mimeType
	);
};

export default function ResourceDownload(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to write directly to the response
}
