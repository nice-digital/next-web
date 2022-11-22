import { type GetServerSideProps } from "next/types";
import React from "react";

import { ResourceList } from "@/components/ResourceList/ResourceList";
import { ProjectDetail } from "@/feeds/inDev/inDev";
import { validateRouteParams } from "@/utils/product";
import { ResourceGroupViewModel } from "@/utils/resource";

export type HistoryPageProps = {
	project: Pick<ProjectDetail, "reference" | "title"> & {
		groups: ResourceGroupViewModel[];
	};
};

export default function HistoryPage({
	project,
}: HistoryPageProps): JSX.Element {
	return <ResourceList groups={project.groups} />;
}

export const getServerSideProps: GetServerSideProps<
	HistoryPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const { project, historyPanels } = result;

	if (!project) return { notFound: true };

	const groups = historyPanels.map((panel) => {
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
				reference: project.reference,
				title: project.title,
				groups,
			},
		},
	};
};
