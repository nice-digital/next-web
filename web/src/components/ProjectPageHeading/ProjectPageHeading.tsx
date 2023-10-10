import { type FC } from "react";

import { PageHeader } from "@nice-digital/nds-page-header";

import { IndevSchedule, ProjectStatus } from "@/feeds/inDev/types";
import { formatDateStr } from "@/utils/datetime";

import { Link } from "../Link/Link";

export type ProjectPageHeadingProps = {
	projectPath: string;
	projectType: string | null;
	reference: string;
	title: string;
	status: string;
	indevScheduleItems?: IndevSchedule[];
	indevStakeholderRegistration?: Record<string, unknown>[];
	isGuidanceHubPage?: boolean | null;
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
	isGuidanceHubPage,
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

	let indevRegisterAnInterestLink = null;
	if (projectType == "IPG" && status != ProjectStatus.Discontinued) {
		indevRegisterAnInterestLink = `/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest?t=0&p=${reference}&returnUrl=${projectPath}`;
	}

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
				indevRegisterAnInterestLink ? (
					<Link
						to={`/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-register-an-interest?t=0&p=${reference}&returnUrl=${projectPath}`}
					>
						Register an interest
					</Link>
				) : null,
				!isGuidanceHubPage &&
				indevStakeholderRegistration &&
				indevStakeholderRegistration.length > 0 ? (
					<Link
						to={
							(indevStakeholderRegistration[0].href +
								`?t=&p=${reference}&returnUrl=${projectPath}`) as string
						}
					>
						Register as a stakeholder
					</Link>
				) : null,
			].filter(Boolean)}
			cta={
				shouldUseNewConsultationComments ? (
					<Link to="/consultations/leadinformation">
						Request commenting lead permission
					</Link>
				) : null
			}
		/>
	);
};
