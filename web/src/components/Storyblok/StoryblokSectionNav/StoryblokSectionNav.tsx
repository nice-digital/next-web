import React from "react";

import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import styles from "./StoryblokSectionNav.module.scss";

type Link = {
	id: number;
	slug: string;
	parent_id: number;
	name: string;
	is_folder: boolean;
	is_startpage: boolean;
	real_path: string;
	childLinks?: Link[];
};

type StoryblokSectionNavProps = {
	parentChildLinksTreeArray: Link[];
	currentPageNoChildrenTree: Link[];
	slug: string;
};

export const StoryblokSectionNav = ({
	parentChildLinksTreeArray,
	currentPageNoChildrenTree,
	slug,
}: StoryblokSectionNavProps): JSX.Element => {
	const sectionNavTree =
		currentPageNoChildrenTree?.length === 0
			? parentChildLinksTreeArray
			: currentPageNoChildrenTree;
	const sectionNavLabel = sectionNavTree[0];
	const sectionNavTreeWithoutLabel =
		sectionNavTree?.length > 0 ? sectionNavTree.slice(1) : [];
	return (
		<>
			<StackedNav
				label={sectionNavLabel?.name}
				className={styles["storyblok-section-nav"]}
			>
				{sectionNavTreeWithoutLabel?.map((parent) => (
					<StackedNavLink
						destination={parent.real_path}
						key={parent.id}
						isCurrent={parent.slug === slug ? true : false}
						nested={parent.childLinks?.map((child: Link) => (
							<StackedNavLink
								destination={child.real_path}
								key={child.id}
								isCurrent={child.slug === slug ? true : false}
							>
								{child.name}
							</StackedNavLink>
						))}
					>
						{parent.name}
					</StackedNavLink>
				))}
			</StackedNav>
		</>
	);
};
