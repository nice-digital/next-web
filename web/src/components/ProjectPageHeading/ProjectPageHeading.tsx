import { type FC } from "react";

import { PageHeader } from "@nice-digital/nds-page-header";

import { IndevSchedule, ProjectStatus } from "@/feeds/inDev/types";
import { formatDateStr } from "@/utils/datetime";

export type ProjectPageHeadingProps = {
	projectPath: string;
	projectType: string | null;
	reference: string;
	title: string;
	status: string;
	indevScheduleItems?: IndevSchedule[];
	indevStakeholderRegistration?: Record<string, unknown>[];
	isGuidanceHubPage?: boolean;
	shouldUseNewConsultationComments?: boolean | null;
	children?: never;
};

export const ProjectPageHeading: FC<ProjectPageHeadingProps> = ({
	projectPath,
	projectType,
	reference,
	title,
	status,
	indevScheduleItems,
	indevStakeholderRegistration,
	isGuidanceHubPage = false,
	shouldUseNewConsultationComments,
}) => {
	const expectedPublicationInfo = indevScheduleItems?.find(
		(item) => item.column1 === "Expected publication"
	);

	let publicationMeta = expectedPublicationInfo ? (
		<>
			<span>Expected publication date:&nbsp;</span>
			<time dateTime={expectedPublicationInfo.column2}>
				{formatDateStr(expectedPublicationInfo.column2)}
			</time>
		</>
	) : status != "Discontinued" ? (
		"Expected publication date: TBC"
	) : null;

	if (isGuidanceHubPage) publicationMeta = null;

	const indevRegisterAnInterestLink =
		projectType == "IPG" && status != ProjectStatus.Discontinued ? (
			<a
				href={`/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest?t=0&p=${reference}&returnUrl=${projectPath}`}
			>
				Register an interest
			</a>
		) : null;

	const indevStakeholderRegistrationLink =
		indevStakeholderRegistration && indevStakeholderRegistration.length > 0 ? (
			<>
				{indevRegisterAnInterestLink && <> | </>}
				<a
					href={`${indevStakeholderRegistration[0].href}?t=&p=${reference}&returnUrl=${projectPath}`}
				>
					Register as a stakeholder
				</a>
			</>
		) : null;

	const indevRequestCommentingLeadLink = shouldUseNewConsultationComments ? (
		<>
			{indevRegisterAnInterestLink ||
				(indevStakeholderRegistrationLink && <> | </>)}
			<a href="/consultations/leadinformation">
				Request commenting lead permission
			</a>
		</>
	) : null;

	const showCta =
		indevRegisterAnInterestLink ||
		indevStakeholderRegistrationLink ||
		indevRequestCommentingLeadLink;

	return (
		<PageHeader
			heading={title}
			useAltHeading
			id="content-start"
			metadata={[
				status != "Discontinued"
					? `In development ${reference}`
					: `Discontinued ${reference}`,
				publicationMeta,
			].filter(Boolean)}
			cta={
				showCta ? (
					<>
						{indevRegisterAnInterestLink}
						{indevStakeholderRegistrationLink}
						{indevRequestCommentingLeadLink}
					</>
				) : null
			}
		/>
	);
};
