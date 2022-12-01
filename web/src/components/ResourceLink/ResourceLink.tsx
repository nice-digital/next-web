import { filesize } from "filesize";
import { type FC } from "react";

import { Card, type CardMetaDataProps } from "@nice-digital/nds-card";

import { isTruthy } from "@/utils/array";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { type ResourceLinkViewModel } from "@/utils/resource";

export type ResourceLinkProps = {
	resourceLink: ResourceLinkViewModel;
};

export const ResourceLink: FC<ResourceLinkProps> = ({ resourceLink }) => {
	const fileSize =
		resourceLink.fileSize && resourceLink.fileSize > 0
			? filesize(resourceLink.fileSize, {
					round: resourceLink.fileSize > 999999 ? 2 : 0,
			  })
			: null;

	const cardMeta: CardMetaDataProps[] = [
		{
			// Hack because of a bug with the card component rendering a 0 when no metadata
			label: "Type",
			value: resourceLink.type,
		},
		resourceLink.date
			? {
					label: "Date",
					value: (
						<time dateTime={stripTime(resourceLink.date)}>
							{formatDateStr(resourceLink.date)}
						</time>
					),
			  }
			: undefined,
		resourceLink.fileTypeName
			? { label: "File type", value: resourceLink.fileTypeName }
			: undefined,
		resourceLink.fileSize && resourceLink.fileSize > 0
			? {
					label: "File size",
					value: fileSize,
			  }
			: undefined,
	].filter(isTruthy);

	return (
		<li key={resourceLink.href}>
			<Card
				headingText={`${resourceLink.title}${
					resourceLink.fileTypeName
						? ` (${resourceLink.fileTypeName}, ${fileSize})`
						: ""
				}`}
				link={{
					destination: resourceLink.href,
				}}
				metadata={cardMeta}
			/>
		</li>
	);
};
