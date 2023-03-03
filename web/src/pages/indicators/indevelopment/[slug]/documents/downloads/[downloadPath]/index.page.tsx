import { GetServerSideProps } from "next/types";

import { getFileStream } from "@/feeds/inDev/inDev";
import { logger } from "@/logger";
import { arrayify } from "@/utils/array";
import { validateRouteParams } from "@/utils/project";
import { getServerSideFile } from "@/utils/response";

// Resource download links are in the form "gid-dg10049-some-title.pdf"
const downloadPathRegex =
	/^(?<projectReference>[A-Za-z]+-[A-Za-z0-9]+\d+)-(?<resourceTitleId>.*)\.(?<extension>[^.]+)$/;

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	{
		slug: string;
		downloadPath: string;
	}
> = async ({ res, params, resolvedUrl }) => {
	if (!params || !params.downloadPath) return { notFound: true };

	const result = await validateRouteParams({ params, resolvedUrl });

	if ("notFound" in result || "redirect" in result) return result;

	const { project, panels } = result;

	if (!project) {
		logger.info(`Project could not be found for project ${params.slug}`);
		return { notFound: true };
	}

	const pathRegexMatch = params.downloadPath.match(downloadPathRegex);

	if (!pathRegexMatch || !pathRegexMatch.groups) {
		logger.info(
			`Download path of ${params.downloadPath} in project ${project.reference} doesn't match expected format of [projectReference]-[resourceTitleId].[extension]`
		);

		return { notFound: true };
	}

	const { projectReference, resourceTitleId, extension } =
			pathRegexMatch.groups,
		resource = panels
			.flatMap((panel) =>
				arrayify(
					panel.embedded.niceIndevResourceList.embedded.niceIndevResource
				)
			)
			.find(
				(resource) =>
					resource.embedded?.niceIndevFile.resourceTitleId === resourceTitleId
			);

	if (projectReference.toLowerCase() !== project.reference.toLowerCase()) {
		logger.info(
			`Resource with ID ${resourceTitleId} belongs to project ${project.reference} but URL was for project ${projectReference}`
		);

		return { notFound: true };
	}

	if (!resource) {
		logger.info(
			`Could not find resource with ID ${resourceTitleId} in project ${project.reference}`
		);

		return { notFound: true };
	}

	const { fileName, links, mimeType } = resource.embedded.niceIndevFile,
		expectedExtension = fileName.split(".").slice(-1)[0].toLowerCase();

	if (expectedExtension.toLowerCase() !== extension.toLowerCase()) {
		logger.info(
			`Found incorrect extension of ${extension} in resource ${resourceTitleId} in project ${project.reference}. Expected extension of ${expectedExtension}`
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
