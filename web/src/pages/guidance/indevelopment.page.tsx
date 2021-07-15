import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { inPlaceSort } from "fast-sort";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { getAllProjects, Project, ProjectStatus } from "@/feeds/inDev/inDev";
import { InDevProjectCard } from "@/components/InDevProjectCard/InDevProjectCard";
import { GuidanceListNav } from "@/components/GuidanceListNav/GuidanceListNav";

/**
 * The number of products to show per page, if the user hasn't specified
 */
export const projectsPerPageDefault = 10;

interface InDevGuidancePageProps {
	projects: readonly Project[];
	totalProjects: number;
	/** 1-based index of the current page */
	currentPage: number;
	totalPages: number;
	pageSize: number;
}

export default function InDevGuidancePage({
	pageSize,
	currentPage,
	totalProjects,
	totalPages,
	projects,
}: InDevGuidancePageProps): JSX.Element {
	return (
		<>
			<NextSeo title="Guidance, quality standards and advice in development" />

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/guidance">NICE guidance</Breadcrumb>
				<Breadcrumb>In development</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				preheading="Guidance, quality standards and advice"
				heading="In development"
			/>

			<GuidanceListNav />

			<p>
				Showing {projects.length} products on page {currentPage} of {totalPages}{" "}
				({totalProjects} products total)
			</p>
			<ol className="list list--unstyled">
				{projects.map((project) => (
					<li key={project.Reference}>
						<InDevProjectCard project={project} />
					</li>
				))}
			</ol>
		</>
	);
}

export const getServerSideProps = async (
	_context: GetServerSidePropsContext
): Promise<{ props: InDevGuidancePageProps }> => {
	const projectsTask = getAllProjects();

	const allProjects = (await projectsTask).filter(
		(project) =>
			project.Status !== ProjectStatus.Discontinued &&
			project.Status !== ProjectStatus.Proposed
	);

	inPlaceSort(allProjects).by([
		{
			asc: "Title",
			// Case insensitive sorting
			comparer: Intl.Collator().compare,
		},
	]);

	const pageSize = Number(_context.query["ps"]) || projectsPerPageDefault,
		currentPage = Number(_context.query["pa"]) || 1,
		totalProjects = allProjects.length,
		totalPages = Math.ceil(totalProjects / pageSize),
		projects = allProjects.slice(currentPage - 1, pageSize);

	return {
		props: {
			currentPage,
			pageSize,
			totalPages,
			totalProjects,
			projects,
		},
	};
};
