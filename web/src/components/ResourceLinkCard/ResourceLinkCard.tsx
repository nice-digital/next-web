import { type FC } from "react";

import { Card, type CardMetaDataProps } from "@nice-digital/nds-card";

import { isTruthy } from "@/utils/array";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { type ResourceLinkViewModel } from "@/utils/resource";

import { FileSize } from "../FileSize/FileSize";
import { ScrollToContentStartLink } from "../Link/Link";

export type ResourceLinkCardProps = {
	resourceLink: ResourceLinkViewModel;
};

export const ResourceLinkCard: FC<ResourceLinkCardProps> = ({
	resourceLink,
}) => {
	const cardMeta: CardMetaDataProps[] = [
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
	].filter(isTruthy);

	return (
		<Card
			headingText={
				<>
					{resourceLink.title}
					{resourceLink.fileSize && resourceLink.fileTypeName ? (
						<>
							{" "}
							({resourceLink.fileTypeName},{" "}
							<FileSize fileSizeBytes={resourceLink.fileSize} />)
						</>
					) : null}
				</>
			}
			link={{
				destination: resourceLink.href,
				elementType:
					resourceLink.fileSize || resourceLink.href[0] !== "/"
						? "a"
						: ScrollToContentStartLink,
			}}
			metadata={cardMeta}
		/>
	);
};
