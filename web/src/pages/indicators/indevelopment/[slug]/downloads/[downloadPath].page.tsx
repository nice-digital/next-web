import { GetServerSideProps } from "next/types";

import { getFileStream } from "@/feeds/inDev/inDev";
import { logger } from "@/logger";
import { arrayify } from "@/utils/array";
import { validateRouteParams } from "@/utils/project";
import { getServerSideFile } from "@/utils/response";

// Resource download links are in the form "gid-dg10049-some-title.pdf"
const downloadPathRegex =
	/^(?<projectReference>[A-Za-z]+-[A-Za-z0-9]+\d+)-(?<resourceTitleId>.*)\.(?<extension>[^.]+)$/;

export type Params = { slug: string; downloadPath: string };

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	Params
> = async ({ res, params, resolvedUrl, query }) => {
	if (!params || !params.downloadPath) return { notFound: true };

	const result = await validateRouteParams({ params, resolvedUrl, query });

	if ("notFound" in result || "redirect" in result) return result;

	const { project, panels, projectPath } = result;

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
			.find((resource) => {
				const indevFile =
					resource.embedded?.niceIndevFile ||
					resource.embedded?.niceIndevGeneratedPdf;

				return indevFile?.resourceTitleId === resourceTitleId;
			});

	if (projectReference.toLowerCase() !== project.reference.toLowerCase()) {
		logger.info(
			`Resource with ID '${resourceTitleId}' belongs to project ${project.reference} but URL was for project ${projectReference}`
		);

		return { notFound: true };
	}

	if (!resource) {
		logger.info(
			`Could not find resource with ID '${resourceTitleId}' in project ${project.reference}`
		);

		return { notFound: true };
	}

	// don't think this should include niceIndevConvertedDocument
	const indevFile =
		resource.embedded?.niceIndevFile ||
		resource.embedded?.niceIndevGeneratedPdf;

	if (!indevFile) {
		throw new Error(
			`Could not find file resource for ID '${resourceTitleId}' in project ${project.reference}`
		);
	}

	const { fileName, links, mimeType } = indevFile;

	// It doesn't make sense to download an HTML file, so redirect to the correct document URL instead
	if (mimeType === "text/html") {
		logger.info(
			`Redirecting HTML resource with id '${resourceTitleId}' in project ${project.reference}`
		);

		return {
			redirect: {
				permanent: true,
				destination: `${projectPath}/documents/${resourceTitleId}`,
			},
		};
	}

	const expectedExtension = fileName.split(".").slice(-1)[0].toLowerCase();

	if (expectedExtension.toLowerCase() !== extension.toLowerCase()) {
		logger.info(
			`Found incorrect extension of ${extension} in resource '${resourceTitleId}' in project ${project.reference}. Expected extension of ${expectedExtension}`
		);

		return { notFound: true };
	}

	return getServerSideFile(
		await getFileStream(links.self[0].href),
		res,
		mimeType
	);
};

/* istanbul ignore next */
export default function FileDownload(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to write directly to the response
}
