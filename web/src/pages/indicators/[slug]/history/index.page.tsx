import { type GetServerSideProps } from "next/types";
import React from "react";

import { getProjectDetail, ProjectDetail } from "@/feeds/inDev/inDev";
import { isErrorResponse } from "@/feeds/publications/publications";
import { validateRouteParams } from "@/utils/product";

export type HistoryHtml = {
	title: string;
	href: string;
};

export type HistoryResource = {
	title: string;
	fileType: string;
	fileName: string;
	fileSize: string;
	link: string;
	reference: string;
	resourceTitleId: string;
	publishedDate: string;
};

export type History = HistoryHtml | HistoryResource;

export type HistoryPageProps = {
	inDevReference: string;
	project: Pick<ProjectDetail, "reference" | "title"> & {
		// panels: Record<string, unknown>[];
		// panels: {
		// 	title: string;
		// 	resources: IndevResource[] | IndevResource;
		// }[];
		panels: { title: string; resources: History[] | HistoryResource };
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
							{Array.isArray(panel.resources) ? (
								panel.resources.map((item, index) => {
									return (
										<p key={index}>
											<strong>{item.title}</strong>
											<br />
											{item.href && `href: ${item.href}`}
											<br />
											{item.fileName && `fileName: ${item.fileName}`}
											<br />
											{item.fileSize && `fileSize: ${item.fileSize}`}
											<br />
											{item.fileType && `fileType: ${item.fileType}`}
											<br />
											{item.publishedDate &&
												`publishedDate: ${item.publishedDate}`}
											<br />
										</p>
									);
								})
							) : (
								<>
									<p>{panel.title}</p>
									{panel.resources.href && `href: ${panel.resources.href}`}
									<br />
									{panel.resources.fileName &&
										`fileName: ${panel.resources.fileName}`}
									<br />
									{panel.resources.fileType &&
										`fileType: ${panel.resources.fileType}`}
									<br />
									{panel.resources.fileSize &&
										`fileSize: ${panel.resources.fileSize}`}
									<br />
									{panel.resources.publishedDate &&
										`publishedDate: ${panel.resources.publishedDate}`}
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
			// panel.title == "Consultation comments published"
		)
		.map((panel) => {
			const indevResource =
				panel.embedded.niceIndevResourceList.embedded.niceIndevResource;

			const resources = Array.isArray(indevResource)
				? indevResource.map((resource) => {
						console.log({ resource });
						const indevFile = resource.embedded?.niceIndevFile;

						if (indevFile?.mimeType == "text/html") {
							return {
								title: resource?.title,
								href: indevFile?.links?.self[0]?.href,
							};
						} else {
							return {
								title: resource.title,
								fileName: indevFile?.fileName,
								fileType: indevFile?.mimeType,
								fileSize: indevFile?.length,
								link: indevFile?.links?.self[0]?.href,
								reference: indevFile?.reference,
								resourceTitleId: indevFile?.resourceTitleId,
								publishedDate: resource.publishedDate,
							};
						}
				  })
				: {
						title: indevResource.title,
						fileName: indevResource.embedded.niceIndevFile.fileName,
						fileType: indevResource.embedded.niceIndevFile.mimeType,
						fileSize: indevResource.embedded.niceIndevFile.length,
						link: indevResource.embedded.niceIndevFile.links.self[0]?.href,
						reference: indevResource.embedded.niceIndevFile.reference,
						resourceTitleId:
							indevResource.embedded.niceIndevFile.resourceTitleId,
						publishedDate: indevResource.publishedDate,
				  };

			// console.log({ resources });

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
