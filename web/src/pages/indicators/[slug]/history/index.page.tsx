import Link from "next/link";
import { type GetServerSideProps } from "next/types";
import React from "react";

import { getProjectDetail, ProjectDetail } from "@/feeds/inDev/inDev";
import { isErrorResponse } from "@/feeds/publications/publications";
import { validateRouteParams } from "@/utils/product";

export type ProjectDetailProps = {
	project: Pick<ProjectDetail, "reference" | "title" | "embedded">;
};

export type HistoryPageProps = {
	inDevReference: string;
	project: ProjectDetailProps["project"];
};

export default function HistoryPage({
	inDevReference,
	project,
}: HistoryPageProps): JSX.Element {
	console.log(project.embedded.niceIndevPanelList);
	console.log(project.embedded.niceIndevPanelList.embedded.niceIndevPanel);

	return (
		<>
			<h2>Indicators history</h2>
			<p>inDevReference: {inDevReference}</p>
			<p>title: {project.title}</p>
			<h3>Panels</h3>
			{project.embedded.niceIndevPanelList.embedded.niceIndevPanel.map(
				(panel, index) => {
					return (
						<ul key={`panel_${index}`}>
							<li key={`${panel.title}_${index}`}>{panel.title}</li>
							{panel.embedded.niceIndevResourceList.hasResources ? (
								<>
									<hr />
									<ul>
										<li>
											{
												panel.embedded.niceIndevResourceList.embedded
													.niceIndevResource.title
											}
											<br />
											<a>
												{
													panel.embedded.niceIndevResourceList.embedded
														.niceIndevResource.embedded?.niceIndevFile?.fileName
												}
											</a>
										</li>
									</ul>
								</>
							) : null}
						</ul>
					);
				}
			)}
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

	// console.log(project);
	// const { reference, title } = project;

	if (!params || !project.embedded.niceIndevPanelList)
		return { notFound: true };

	return {
		props: {
			inDevReference: result.product.inDevReference,
			project,
		},
	};
};
