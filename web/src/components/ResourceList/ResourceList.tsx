import { type FC } from "react";

import { type ResourceGroupViewModel } from "@/utils/resource";

import { ResourceLink } from "../ResourceLink/ResourceLink";

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
			{groupsToShow.map((group, i) => (
				<section key={`${group.title}${i}`}>
					<h3>
						<a id={`${group.title.replace(/ /g, "-").toLowerCase()}${i}`}></a>
						{group.title}
					</h3>

					{group.subGroups.map((subGroup) => (
						<section key={`${group.title} ${subGroup.title}`}>
							<h4
								className={
									subGroup.title === group.title ? "visually-hidden" : ""
								}
							>
								<a id={subGroup.title.replace(/ /g, "-").toLowerCase()}></a>
								{subGroup.title}
							</h4>
							<ul className="list list--unstyled">
								{subGroup.resourceLinks.map((resourceLink) => (
									<ResourceLink
										key={resourceLink.href}
										resourceLink={resourceLink}
									/>
								))}
							</ul>
						</section>
					))}
				</section>
			))}
		</>
	);
};
