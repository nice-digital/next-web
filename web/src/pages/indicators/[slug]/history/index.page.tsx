import { type GetServerSideProps } from "next/types";
import React from "react";

import { ResourceList } from "@/components/ResourceList/ResourceList";
import { getProjectDetail, ProjectDetail } from "@/feeds/inDev/inDev";
import { isErrorResponse } from "@/feeds/publications/publications";
import { validateRouteParams } from "@/utils/product";
import { ResourceGroupViewModel } from "@/utils/resource";

// export type HistoryResource = {
// 	title: string;
// 	textOnly?: boolean;
// 	fileType?: string;
// 	fileName?: string;
// 	fileSize?: number;
// 	href: string;
// 	reference?: string;
// 	resourceTitleId?: string;
// 	publishedDate?: string;
// };

// export type HistoryPanel = { title: string; resources: HistoryResource[] };

export type HistoryPageProps = {
	project: Pick<ProjectDetail, "reference" | "title"> & {
		// panels: HistoryPanel[];
		groups: ResourceGroupViewModel[];
	};
};

export default function HistoryPage({
	project,
}: // groups,
HistoryPageProps): JSX.Element {
	return <ResourceList groups={project.groups} />;
}

export const getServerSideProps: GetServerSideProps<
	HistoryPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const project = await getProjectDetail("GID-NG10014");

	if (isErrorResponse(project)) throw new Error("project not found");

	const { reference, title } = project;

	if (!project.embedded.niceIndevPanelList) return { notFound: true };

	const groups = project.embedded.niceIndevPanelList.embedded.niceIndevPanel
		.filter((panel) => panel.showPanel && panel.panelType == "History")
		.map((panel) => {
			const indevResource =
				panel.embedded.niceIndevResourceList.embedded.niceIndevResource;

			const indevResources = Array.isArray(indevResource)
				? indevResource
				: [indevResource];

			const subGroups = indevResources.map((resource) => {
				const resourceLinks = resource.embedded;

				if (resourceLinks) {
					return {
						title: resource.title,
						resourceLinks: [
							{
								title: resource.title,
								href: resourceLinks.niceIndevFile.links.self[0].href,
								fileTypeName: resourceLinks.niceIndevFile.mimeType,
								fileSize: resourceLinks.niceIndevFile.length,
								date: resource.publishedDate,
							},
						],
					};
				}
				return { title: resource.title, resourceLinks: [] };
			});

			return {
				title: panel.title,
				subGroups,
			};
		});

	return {
		props: {
			inDevReference: result.product.inDevReference,
			project: {
				reference,
				title,
				// panels,
				groups,
			},
		},
	};
};
