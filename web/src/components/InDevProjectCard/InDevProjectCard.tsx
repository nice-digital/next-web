import { FC } from "react";

import { Card, CardMetaDataProps } from "@nice-digital/nds-card";

import { Project, ProjectStatus } from "@/feeds/inDev/types";
import { formatDateStr, getProjectPath } from "@/utils";

export interface InDevProjectCardProps {
	project: Project;
}

export const InDevProjectCard: FC<InDevProjectCardProps> = ({ project }) => {
	const { Title, ProductTypeName, Status, PublishedDate, Reference } = project,
		destination = getProjectPath(project);

	const metadata: (CardMetaDataProps | undefined)[] = [
		{ label: "Product type:", value: ProductTypeName },
		Status !== ProjectStatus.Proposed
			? {
					label: "Expected publication date",
					value: PublishedDate ? (
						<time dateTime={PublishedDate}>{formatDateStr(PublishedDate)}</time>
					) : (
						"TBC"
					),
			  }
			: undefined,
		{ label: "Reference:", value: Reference },
	].filter(Boolean);

	return (
		<Card
			headingText={<data value={Reference}>{Title}</data>}
			metadata={metadata as CardMetaDataProps[]}
			link={destination ? { destination } : undefined}
		></Card>
	);
};
