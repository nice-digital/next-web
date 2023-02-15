import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { IndevSchedule, ProjectDetail } from "@/feeds/inDev/types";
import { arrayify } from "@/utils/array";
import { validateRouteParams } from "@/utils/project";

export type DocumentHTMLPageProps = {
	indevScheduleItems?: IndevSchedule[];
	indevStakeholderRegistration: Record<string, unknown>[];
	project: Pick<
		ProjectDetail,
		"projectType" | "reference" | "title" | "status"
	>;
};

export default function HistoryHTMLPage(
	props: DocumentHTMLPageProps
): JSX.Element {
	return (
		<>
			<NextSeo
				title={`TODO-HTMLpagetitle | Project documents | ${props.project.title} | Indicators | Standards and Indicators`}
			/>

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators">
					Standards and Indicators
				</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators/indevelopment">
					In development
				</Breadcrumb>
				<Breadcrumb
					to={`/standards-and-indicators/indicators/indevelopment/${props.project.reference}`}
				>
					{props.project.reference}
				</Breadcrumb>
				<Breadcrumb
					to={`/standards-and-indicators/indicators/indevelopment/${props.project.reference}/documents/`}
				>
					Project documents
				</Breadcrumb>
				<Breadcrumb>TODO-htmldoc title</Breadcrumb>
			</Breadcrumbs>

			<ProjectPageHeading
				projectType={props.project.projectType}
				reference={props.project.reference}
				title={props.project.title}
				status={props.project.status}
				indevScheduleItems={props.indevScheduleItems}
				indevStakeholderRegistration={props.indevStakeholderRegistration}
			/>
			<p>html page content here</p>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	DocumentHTMLPageProps,
	{ slug: string; htmlPath: string }
> = async ({ params, resolvedUrl, query }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const { project } = result;

	if (!project) return { notFound: true };

	const { projectType, reference, status, title } = project;

	const indevSchedule =
			project.embedded.niceIndevProvisionalScheduleList?.embedded
				.niceIndevProvisionalSchedule,
		indevScheduleItems = arrayify(indevSchedule),
		indevStakeholderRegistration = arrayify(
			project.links.niceIndevStakeholderRegistration
		);

	return {
		props: {
			indevScheduleItems,
			indevStakeholderRegistration,
			project: {
				projectType,
				reference,
				status,
				title,
			},
		},
	};
};
