import { FC } from "react";

import { Card, CardMetaDataProps } from "@nice-digital/nds-card";

import { Project, ProjectStatus } from "@/feeds/inDev/types";
import { formatDateStr, getProjectPath } from "@/utils";

export interface InDevProjectCardProps {
	project: Project;
}

/**
 * NICE Design System Card component for an in development project
 */
export const InDevProjectCard: FC<InDevProjectCardProps> = ({ project }) => {
	const { Title, ProductTypeName, Status, PublishedDate, Reference } = project,
		destination = getProjectPath(project);

	const metadata: (CardMetaDataProps | undefined)[] = [
		{ label: "Product type:", value: ProductTypeName },
		Status !== ProjectStatus.Proposed
			? {
					visibleLabel: true,
					label: "Expected publication date:",
					value: PublishedDate ? (
						<time dateTime={PublishedDate}>{formatDateStr(PublishedDate)}</time>
					) : (
						<abbr title="To be confirmed">TBC</abbr>
					),
			  }
			: undefined,
		{
			visibleLabel: true,
			label: "Reference:",
			value: Reference,
		},
	].filter(Boolean);

	return (
		<Card
			headingText={<data value={Reference}>{Title}</data>}
			metadata={metadata as CardMetaDataProps[]}
			link={destination ? { destination } : undefined}
		></Card>
	);
};
