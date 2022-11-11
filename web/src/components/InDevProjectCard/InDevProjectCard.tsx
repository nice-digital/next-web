import { FC } from "react";

import { Card, CardMetaDataProps } from "@nice-digital/nds-card";

import { Project, ProjectStatus } from "@/feeds/inDev/types";
import { formatDateStr } from "@/utils/datetime";
import { getProjectPath } from "@/utils/url";

export interface InDevProjectCardProps {
	project: Project;
}

/**
 * NICE Design System Card component for an in development project
 */
export const InDevProjectCard: FC<InDevProjectCardProps> = ({ project }) => {
	const { title, productTypeName, status, publishedDate, reference } = project,
		destination = getProjectPath(project);

	const metadata: (CardMetaDataProps | undefined)[] = [
		{ label: "Product type:", value: productTypeName },
		status !== ProjectStatus.Proposed
			? {
					visibleLabel: true,
					label: "Expected publication date:",
					value: publishedDate ? (
						<time dateTime={publishedDate}>{formatDateStr(publishedDate)}</time>
					) : (
						<abbr title="To be confirmed">TBC</abbr>
					),
			  }
			: undefined,
		{
			visibleLabel: true,
			label: "Reference:",
			value: reference,
		},
	].filter(Boolean);

	return (
		<Card
			headingText={<data value={reference}>{title}</data>}
			metadata={metadata as CardMetaDataProps[]}
			link={destination ? { destination } : undefined}
		></Card>
	);
};
