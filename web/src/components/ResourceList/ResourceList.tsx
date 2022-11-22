import { filesize } from "filesize";
import { type FC } from "react";

import { Card, type CardMetaDataProps } from "@nice-digital/nds-card";

import { isTruthy } from "@/utils/array";
import { formatDateStr, stripTime } from "@/utils/datetime";
import { type ResourceGroupViewModel } from "@/utils/resource";

import { ScrollToContentStartLink } from "../Link/Link";

export type ResourceListProps = {
	groups: ResourceGroupViewModel[];
};

export const ResourceList: FC<ResourceListProps> = ({ groups }) => {
	const groupsToShow = groups.filter((group) =>
		group.subGroups.some((subGroup) => subGroup.resourceLinks.length > 0)
	);

	if (groupsToShow.length === 0) return null;

	return (
		<>
			{groupsToShow.map((group) => (
				<section key={group.title}>
					<h3>{group.title}</h3>

					{group.subGroups.map((subGroup) => (
						<section key={subGroup.title}>
							<h4
								className={
									subGroup.title === group.title ? "visually-hidden" : ""
								}
							>
								{subGroup.title}
							</h4>
							<ul className="list list--unstyled">
								{subGroup.resourceLinks.map((resource) => {
									const fileSize =
										resource.fileSize && resource.fileSize > 0
											? filesize(resource.fileSize, {
													round: resource.fileSize > 999999 ? 2 : 0,
											  })
											: null;

									const cardMeta: CardMetaDataProps[] = [
										{
											// Hack because of a bug with the card component rendering a 0 when no metadata
											label: "Type",
											value: subGroup.title,
										},
										resource.date
											? {
													label: "Date",
													value: (
														<time dateTime={stripTime(resource.date)}>
															{formatDateStr(resource.date)}
														</time>
													),
											  }
											: undefined,
										resource.fileTypeName
											? { label: "File type", value: resource.fileTypeName }
											: undefined,
										resource.fileSize && resource.fileSize > 0
											? {
													label: "File size",
													value: fileSize,
											  }
											: undefined,
									].filter(isTruthy);

									return (
										<li key={resource.title}>
											<Card
												headingText={`${resource.title}${
													resource.fileTypeName
														? ` (${resource.fileTypeName}, ${fileSize})`
														: ""
												}`}
												link={{
													destination: resource.href,
													elementType: resource.fileTypeName
														? "a"
														: ScrollToContentStartLink,
												}}
												metadata={cardMeta}
											/>
										</li>
									);
								})}
							</ul>
						</section>
					))}
				</section>
			))}
		</>
	);
};
