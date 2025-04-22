import React from "react";

import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import styles from "./StoryblokSectionNav.module.scss";
import { type ExtendedSBLink } from "./utils/Utils";

type StoryblokSectionNavProps = {
	tree: ExtendedSBLink[];
	slug: string;
};

export const StoryblokSectionNav = ({
	tree,
	slug,
}: StoryblokSectionNavProps): JSX.Element => {
	const sectionNavLabel = tree[0];
	const sectionNavTreeWithoutLabel = tree?.length > 0 ? tree.slice(1) : [];
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
						nested={parent.childLinks?.map((child: ExtendedSBLink) => (
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
