import { type FC, type ReactNode } from "react";

import { Grid, GridItem } from "@nice-digital/nds-grid";

import { OnThisPage } from "@/components/OnThisPage/OnThisPage";
import { type ResourceGroupViewModel } from "@/utils/resource";
import { slugify } from "@/utils/url";

import { ResourceLinkCard } from "../ResourceLinkCard/ResourceLinkCard";

import styles from "./ResourceList.module.scss";

export type ResourceListProps = {
	title: ReactNode;
	groups: ResourceGroupViewModel[];
};

const hasResources = ({ subGroups }: ResourceGroupViewModel) =>
	subGroups.some(({ resourceLinks }) => resourceLinks.length);

export const ResourceList: FC<ResourceListProps> = ({ title, groups }) => {
	const groupsToShow = groups.filter(hasResources),
		hasOnThisPageMenu = groupsToShow.length > 1,
		countingSlugify = slugify.counter(),
		groupsWithSlugs = groupsToShow.map((group) => ({
			group,
			slug: countingSlugify(group.title),
		}));

	if (groupsToShow.length === 0) return null;

	return (
		<Grid gutter="loose">
			<GridItem cols={12} md={12} lg={12} elementType="section">
				<Grid reverse gutter="loose">
					{hasOnThisPageMenu ? (
						<GridItem cols={12} md={4} lg={3}>
							<OnThisPage
								sections={groupsWithSlugs.map(({ group, slug }) => ({
									slug: slug,
									title: group.title,
								}))}
							/>
						</GridItem>
					) : null}
					<GridItem
						cols={12}
						md={hasOnThisPageMenu ? 8 : 12}
						lg={hasOnThisPageMenu ? 9 : 12}
					>
						<h2 className={styles.title}>{title}</h2>
						{groupsWithSlugs.map(({ group, slug }, i) => (
							<section key={slug} aria-labelledby={slug}>
								<h3 id={slug}>{group.title}</h3>

								{group.subGroups.map((subGroup) => (
									<section key={`${slug} ${subGroup.title}`}>
										<h4
											className={
												subGroup.title === group.title ? "visually-hidden" : ""
											}
										>
											{subGroup.title}
										</h4>
										<ul className="list list--unstyled">
											{subGroup.resourceLinks.map((resourceLink) => (
												<li key={resourceLink.href}>
													<ResourceLinkCard resourceLink={resourceLink} />
												</li>
											))}
										</ul>
									</section>
								))}
							</section>
						))}
					</GridItem>
				</Grid>
			</GridItem>
		</Grid>
	);
};
