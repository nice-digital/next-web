import { type GetServerSideProps } from "next/types";
import React from "react";

import { getProjectDetail, ProjectDetail } from "@/feeds/inDev/inDev";
import { isErrorResponse } from "@/feeds/publications/publications";
import { validateRouteParams } from "@/utils/product";

export type HistoryResource = {
	title: string;
	textOnly?: boolean;
	fileType?: string;
	fileName?: string;
	fileSize?: string;
	href: string;
	reference?: string;
	resourceTitleId?: string;
	publishedDate?: string;
};

export type HistoryPanel = { title: string; resources: HistoryResource[] };

export type HistoryPageProps = {
	inDevReference: string;
	project: Pick<ProjectDetail, "reference" | "title"> & {
		panels: HistoryPanel[];
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
						<div>
							<h3>{panel.title}</h3>
							{panel.resources.map((item, index) => {
								return (
									<p key={index}>
										<strong>{item.title}</strong>
										<br />
										href: {item.href}
										{!item.textOnly && (
											<>
												<br />
												filename: {item.fileName} <br />
												fileType: {item.fileType} <br />
												fileSize: {item.fileSize}
												<br />
											</>
										)}
										{item.publishedDate &&
											`publishedDate: ${item.publishedDate}`}
										<br />
									</p>
								);
							})}
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
		.filter((panel) => panel.showPanel && panel.panelType == "History")
		.map((panel) => {
			const indevResource =
				panel.embedded.niceIndevResourceList.embedded.niceIndevResource;

			const indevResources = Array.isArray(indevResource)
				? indevResource
				: [indevResource];
			const resources = indevResources.map((resource) => {
				const indevFile = resource.embedded?.niceIndevFile;

				if (!indevFile) {
					return {
						title: resource.title,
						textOnly: resource.textOnly,
						publishedDate: resource.publishedDate,
						href: "",
					};
				}

				return {
					title: resource.title,
					textOnly: resource.textOnly,
					fileName: indevFile.fileName,
					fileType: indevFile.mimeType,
					fileSize: indevFile.length,
					href: indevFile.links.self[0].href,
					reference: indevFile.reference,
					resourceTitleId: indevFile.resourceTitleId,
					publishedDate: resource.publishedDate,
				};
			});

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
				panels,
			},
		},
	};
};
