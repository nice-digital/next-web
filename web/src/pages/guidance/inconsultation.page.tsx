import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { inPlaceSort } from "fast-sort";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { getAllConsultations, Consultation } from "@/feeds/inDev/inDev";
import { InDevProjectCard } from "@/components/InDevProjectCard/InDevProjectCard";
import { GuidanceListNav } from "@/components/GuidanceListNav/GuidanceListNav";

/**
 * The number of products to show per page, if the user hasn't specified
 */
export const projectsPerPageDefault = 10;

interface InConsultationsGuidancePageProps {
	consultations: readonly Consultation[];
	totalConsultations: number;
	/** 1-based index of the current page */
	currentPage: number;
	totalPages: number;
	pageSize: number;
}

export default function InConsultationsGuidancePage({
	pageSize,
	currentPage,
	totalConsultations,
	totalPages,
	consultations,
}: InConsultationsGuidancePageProps): JSX.Element {
	return (
		<>
			<NextSeo
				title="In consultation | Guidance"
				description="Guidance and quality standards open for consultation"
			/>

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/guidance">NICE guidance</Breadcrumb>
				<Breadcrumb>In consultation</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				preheading="Guidance and quality standards"
				heading="In consultation"
			/>

			<GuidanceListNav />

			<p>
				Showing {consultations.length} products on page {currentPage} of{" "}
				{totalPages} ({totalConsultations} products total)
			</p>
			<ol className="list list--unstyled">
				{consultations.map((consultation) => (
					<li key={consultation.ConsultationId}>
						{/* <InDevProjectCard project={project} /> */}
						{consultation.Title}
					</li>
				))}
			</ol>
		</>
	);
}

export const getServerSideProps = async (
	_context: GetServerSidePropsContext
): Promise<{ props: InConsultationsGuidancePageProps }> => {
	const consultationsTask = getAllConsultations();

	const allConsultations = await consultationsTask;

	inPlaceSort(allConsultations).by([
		{
			asc: "Title",
			// Case insensitive sorting
			comparer: Intl.Collator().compare,
		},
	]);

	const pageSize = Number(_context.query["ps"]) || projectsPerPageDefault,
		currentPage = Number(_context.query["pa"]) || 1,
		totalConsultations = allConsultations.length,
		totalPages = Math.ceil(totalConsultations / pageSize),
		consultations = allConsultations.slice(currentPage - 1, pageSize);

	return {
		props: {
			currentPage,
			pageSize,
			totalPages,
			totalConsultations,
			consultations,
		},
	};
};
