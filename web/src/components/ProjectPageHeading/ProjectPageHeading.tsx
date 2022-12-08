import { type FC } from "react";

import { PageHeader } from "@nice-digital/nds-page-header";

import { IndevSchedule, ProjectDetail } from "@/feeds/inDev/types";
import { formatDateStr, stripTime } from "@/utils/datetime";

export type ProjectPageHeadingProps = {
	project: {
		reference: string;
		title: string;
		status: string;
		indevScheduleItems?: IndevSchedule[];
	};
	children?: never;
};

export const ProjectPageHeading: FC<ProjectPageHeadingProps> = ({
	project: { reference, title, status, indevScheduleItems },
}) => {
	const expectedPublicationInfo = indevScheduleItems?.find(
		(item) => item.column1 === "Expected publication"
	);

	const publicationMeta = expectedPublicationInfo
		? `Expected publication date ${expectedPublicationInfo.column2}`
		: status != "Discontinued"
		? "Expected publication date: TBC"
		: null;

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
				//TODO stakeholder link
				<>Register as a stakeholder</>,
			].filter(Boolean)}
		/>
	);
};
