import { NextSeo } from "next-seo";
import { type GetServerSideProps } from "next/types";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

import { validateRouteParams } from "@/utils/project";

export type ConsultationsPageProps = {
	someProp: string;
};

export default function ConsultationsPage(
	props: ConsultationsPageProps
): JSX.Element {
	return (
		<>
			<NextSeo
				title={`Project documents | TODO Project Title | Indicators | Standards and Indicators`}
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
				<Breadcrumb>Consultations</Breadcrumb>
			</Breadcrumbs>
			Consultations page placeholder
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	ConsultationsPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const { project, projectPath, panels, hasPanels } = result;

	if (!project) return { notFound: true };

	if (!hasPanels) return { notFound: true };

	const { projectType, reference, status, title } = project;

	return {
		props: {
			someProp: "someProp",
		},
	};
};
