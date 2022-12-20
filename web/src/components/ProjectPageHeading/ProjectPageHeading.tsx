import { type FC } from "react";

import { PageHeader } from "@nice-digital/nds-page-header";

import { IndevSchedule } from "@/feeds/inDev/types";
import { formatDateStr } from "@/utils/datetime";

import { Link } from "../Link/Link";

export type ProjectPageHeadingProps = {
	project: {
		reference: string;
		title: string;
		status: string;
		indevScheduleItems?: IndevSchedule[];
		indevStakeholderRegistration?: Record<string, unknown>[];
	};
	children?: never;
};

export const ProjectPageHeading: FC<ProjectPageHeadingProps> = ({
	project: {
		reference,
		title,
		status,
		indevScheduleItems,
		indevStakeholderRegistration,
	},
}) => {
	const expectedPublicationInfo = indevScheduleItems?.find(
		(item) => item.column1 === "Expected publication"
	);

	const publicationMeta = expectedPublicationInfo ? (
		<>
			<span>Expected publication date</span>{" "}
			<time dateTime={expectedPublicationInfo.column2}>
				{formatDateStr(expectedPublicationInfo.column2)}
			</time>
		</>
	) : status != "Discontinued" ? (
		"Expected publication date: TBC"
	) : null;

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
				//TODO stakeholder link query string ? e.g. http://www.nice.org.uk/get-involved/stakeholder-registration/register?t=&p=GID-QS10164&returnUrl=/guidance/indevelopment/gid-qs10164
				indevStakeholderRegistration &&
				indevStakeholderRegistration.length > 0 ? (
					<Link to={indevStakeholderRegistration[0].href as string}>
						Register as a stakeholder
					</Link>
				) : null,
			].filter(Boolean)}
		/>
	);
};
