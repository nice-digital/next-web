import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";

import { ResourceList } from "@/components/ResourceList/ResourceList";
import { ProjectDetail } from "@/feeds/inDev/types";
import { arrayify, byTitleAlphabetically } from "@/utils/array";
import { getFileTypeNameFromMime } from "@/utils/file";
import { validateRouteParams } from "@/utils/project";
import {
	ResourceGroupViewModel,
	ResourceSubGroupViewModel,
} from "@/utils/resource";

export type DocumentsPageProps = {
	project: Pick<ProjectDetail, "reference" | "title"> & {
		groups: ResourceGroupViewModel[];
	};
};

export default function DocumentsPage({
	project,
}: DocumentsPageProps): JSX.Element {
	return (
		<>
			<p>--- TODO Documents page title and project heading ---</p>
			<NextSeo
				title={`Project documents | ${project.title} | Indicators | Standards and Indicators`}
			/>

			<ResourceList
				title="Documents"
				lead="A list of downloadable documents created during development."
				groups={project.groups}
			/>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	DocumentsPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const { project, panels, hasPanels } = result;

	if (!project) return { notFound: true };

	if (!hasPanels) return { notFound: true };

	const groups = panels.sort(byTitleAlphabetically).map((panel) => {
		const indevResource =
			panel.embedded.niceIndevResourceList.embedded.niceIndevResource;

		const indevResources = arrayify(indevResource);

		const subGroups: ResourceSubGroupViewModel[] = [];

		let currentSubGroup: ResourceSubGroupViewModel;

		indevResources.forEach((resource) => {
			if (resource.textOnly) {
				currentSubGroup = { title: resource.title, resourceLinks: [] };
				subGroups.push(currentSubGroup);
			} else {
				if (!currentSubGroup) {
					currentSubGroup = { title: panel.title, resourceLinks: [] };
					subGroups.push(currentSubGroup);
				}

				const { mimeType, length, resourceTitleId, fileName } =
						resource.embedded.niceIndevFile,
					isHTML = mimeType === "text/html",
					fileSize = isHTML ? null : length,
					fileTypeName = isHTML ? null : getFileTypeNameFromMime(mimeType),
					href = isHTML ? `/html-todo` : `/download-todo`;

				currentSubGroup.resourceLinks.push({
					title: resource.title,
					href,
					fileTypeName,
					fileSize,
					date: resource.publishedDate,
					type: panel.title,
				});
			}
		});

		return {
			title: panel.title,
			subGroups,
		};
	});

	console.log({ groups });

	return {
		props: {
			project: {
				reference: project.reference,
				title: project.title,
				groups,
			},
		},
	};
};
