import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { type GetServerSideProps } from "next/types";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { Link } from "@/components/Link/Link";
import { ProjectHorizontalNav } from "@/components/ProjectHorizontalNav/ProjectHorizontalNav";
import { ProjectPageHeading } from "@/components/ProjectPageHeading/ProjectPageHeading";
import { getResourceFileHTML } from "@/feeds/inDev/inDev";
import { IndevSchedule, ProjectDetail } from "@/feeds/inDev/types";
import { arrayify } from "@/utils/array";
import { validateRouteParams } from "@/utils/project";

export type DocumentHTMLPageProps = {
	consultationUrls: string[];
	indevScheduleItems?: IndevSchedule[];
	indevStakeholderRegistration: Record<string, unknown>[];
	project: Pick<
		ProjectDetail,
		"projectType" | "reference" | "title" | "status"
	>;
	projectPath: string;
	consultation: {
		html: string;
		title: string;
	};
};

export default function ConsultationHTMLPage({
	consultation,
	consultationUrls,
	indevStakeholderRegistration,
	project,
	projectPath,
	indevScheduleItems,
}: DocumentHTMLPageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title={`${consultation.title} | ${project.reference} | Indicators | Standards and Indicators`}
			/>
			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators">
					Standards and Indicators
				</Breadcrumb>
				<Breadcrumb to="/standards-and-indicators/indicators">
					Indicators
				</Breadcrumb>
				<Breadcrumb to="/indicators/indevelopment" elementType={Link}>
					In development
				</Breadcrumb>
				<Breadcrumb
					to={`/indicators/indevelopment/${project.reference.toLowerCase()}`}
					elementType={Link}
				>
					{project.reference}
				</Breadcrumb>
				<Breadcrumb>{consultation.title}</Breadcrumb>
			</Breadcrumbs>
			<ProjectPageHeading
				projectPath={projectPath}
				projectType={project.projectType}
				reference={project.reference}
				title={project.title}
				status={project.status}
				indevScheduleItems={indevScheduleItems}
				indevStakeholderRegistration={indevStakeholderRegistration}
			/>
			<ProjectHorizontalNav
				projectPath={projectPath}
				hasDocuments
				consultationUrls={consultationUrls}
			/>

			<div dangerouslySetInnerHTML={{ __html: consultation.html }}></div>
		</>
	);
}

export type Params = {
	slug: string;
	resourceTitleId: string;
};

export const getServerSideProps: GetServerSideProps<
	DocumentHTMLPageProps,
	Params
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams({ params, resolvedUrl });

	if ("notFound" in result || "redirect" in result) return result;

	const { project, projectPath, consultations, consultationUrls } = result;

	const consultation = consultations.find(
		(c) => c.resourceTitleId === params?.resourceTitleId
	);

	if (!consultation) return { notFound: true };

	const consultationFilePath = consultation.links.self[0].href,
		consultationHTML = await getResourceFileHTML(consultationFilePath);

	if (consultationHTML == null) return { notFound: true };

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
			consultationUrls,
			indevScheduleItems,
			indevStakeholderRegistration,
			project: {
				projectType,
				reference,
				status,
				title,
			},
			projectPath,
			consultation: {
				html: consultationHTML,
				title: consultation.consultationName,
			},
		},
	};
};
