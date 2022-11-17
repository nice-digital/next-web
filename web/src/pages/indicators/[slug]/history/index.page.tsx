import { type GetServerSideProps } from "next/types";
import React from "react";

import { getProjectDetail, ProjectDetail } from "@/feeds/inDev/inDev";
import { isErrorResponse } from "@/feeds/publications/publications";
import { validateRouteParams } from "@/utils/product";

export type HistoryPageProps = {
	inDevReference: string;
	project: Pick<ProjectDetail, "reference" | "title"> & {
		panels: Record<string, unknown>[];
	};
};

export default function HistoryPage({
	inDevReference,
	project,
}: HistoryPageProps): JSX.Element {
	return (
		<>
			<h2>Indicators history</h2>
			<p>inDevReference: {inDevReference}</p>
			<p>title: {project.title}</p>
			<h3>Panels</h3>
			{project.panels.map((panel, index) => {
				return (
					<>
						<hr />
						<ul key={`panel_${index}`}>
							<li key={`${panel.title}_${index}`}>{panel.title}</li>
							<li>filename:{panel.filename}</li>
							<li>fileType: {panel.fileType}</li>
							<li>date: {panel.date}</li>
							<li>fileSize: {panel.fileSize} </li>
							{Array.isArray(panel.resources)
								? panel.resources?.map((item, index) => {
										return (
											<li key={`${item.title}_${index}`}>
												{item.title} {item.href}
											</li>
										);
								  })
								: null}
						</ul>
					</>
				);
			})}
		</>
	);
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

	const panels = project.embedded.niceIndevPanelList.embedded.niceIndevPanel
		.filter(
			(panel) => panel.showPanel && panel.panelType == "History"
			//  &&
			// panel.title == "Draft guidance consultation"
		)
		.map((panel) => {
			const indevResource =
				panel.embedded.niceIndevResourceList.embedded.niceIndevResource;

			const resources = Array.isArray(
				panel.embedded.niceIndevResourceList.embedded.niceIndevResource
			)
				? panel.embedded.niceIndevResourceList.embedded.niceIndevResource.map(
						(resource) => ({
							title: resource?.title,
							href: resource?.embedded?.niceIndevFile?.links?.self[0]?.href,
						})
				  )
				: null;

			console.log({ resources });

			return {
				title: panel.title,
				date: indevResource.publishedDate,
				filename: indevResource.embedded?.niceIndevFile?.fileName,
				fileType: indevResource.embedded?.niceIndevFile?.mimeType,
				fileSize: indevResource.embedded?.niceIndevFile?.length,
				link: indevResource.embedded?.niceIndevFile?.links?.self[0]?.href,
				reference: indevResource.embedded?.niceIndevFile?.reference,
				resourceTitleId: indevResource.embedded?.niceIndevFile.resourceTitleId,
				resources,
			};
		});
	// .map((panel) => ({ ...panel }));

	return {
		props: {
			inDevReference: result.product.inDevReference,
			project: {
				reference,
				title,
				panels: JSON.parse(JSON.stringify(panels)),
			},
		},
	};
};
