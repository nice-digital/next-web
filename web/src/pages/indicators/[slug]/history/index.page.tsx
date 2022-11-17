import { type GetServerSideProps } from "next/types";
import React from "react";

import {
	getProjectDetail,
	IndevFile,
	IndevResource,
	ProjectDetail,
} from "@/feeds/inDev/inDev";
import { isErrorResponse } from "@/feeds/publications/publications";
import { validateRouteParams } from "@/utils/product";

export type HistoryPageProps = {
	inDevReference: string;
	project: Pick<ProjectDetail, "reference" | "title"> & {
		panels: Record<string, unknown>[];
		// panels: {
		// 	title: string;
		// 	resources: IndevResource[] | IndevResource;
		// }[];
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
				// console.log("RESOURCES ", panel.resources);
				return (
					<>
						<hr />
						<div>
							<h3>{panel.title}</h3>
							{Array.isArray(panel.resources) ? (
								panel.resources?.map((item, index) => {
									return (
										<p key={index}>
											<strong>{item.title}</strong>
										</p>
									);
								})
							) : (
								<>
									<p>SINGLE OBJECT {panel.title}</p>
								</>
							)}
						</div>
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
			// &&
			// panel.title == "Draft guidance consultation"
		)
		.map((panel) => {
			const indevResource =
				panel.embedded.niceIndevResourceList.embedded.niceIndevResource;

			const resources = Array.isArray(indevResource)
				? indevResource.map((resource) => {
						const indevFile = resource.embedded?.niceIndevFile;

						if (indevFile?.mimeType == "text/html") {
							return {
								title: resource?.title,
								href: indevFile?.links?.self[0]?.href,
							};
						} else {
							return {
								title: resource.title,
								filename: indevFile?.fileName,
								fileType: indevFile?.mimeType,
								fileSize: indevFile?.length,
								link: indevFile?.links?.self[0]?.href,
								reference: indevFile?.reference,
								resourceTitleId: indevFile?.resourceTitleId,
							};
						}
				  })
				: {
						title: indevResource.title,
						fileType: indevResource.embedded.niceIndevFile.mimeType,
						filename: indevResource.embedded.niceIndevFile.fileName,
						fileSize: indevResource.embedded.niceIndevFile.length,
						link: indevResource.embedded.niceIndevFile.links.self[0]?.href,
						reference: indevResource.embedded.niceIndevFile.reference,
						resourceTitleId:
							indevResource.embedded.niceIndevFile.resourceTitleId,
				  };

			console.log({ resources });

			return {
				title: panel.title,
				resources,
			};
		});

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
