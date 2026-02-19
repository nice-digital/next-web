import React from "react";

import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import {
	getSectionnavTitle,
	sectionNavIsPopulated,
} from "../../../utils/storyblok/contentStructureUtils";
import { type ExtendedSBLink } from "../../../utils/storyblok/contentStructureUtils";

type StoryblokSectionNavProps = {
	tree: ExtendedSBLink[];
	slug: string;
};

export const StoryblokSectionNav = ({
	tree,
	slug,
}: StoryblokSectionNavProps): JSX.Element => {
	const sectionNavLabel = getSectionnavTitle(tree);
	const sectionNavTreeWithoutLabel = sectionNavIsPopulated(tree)
		? tree.slice(1)
		: [];
	return (
		<>
			{sectionNavIsPopulated(tree) && (
				<StackedNav
					label={sectionNavLabel?.name}
					aria-label={`Section navigation: ${
						sectionNavLabel?.name ?? "Section"
					}`}
					data-testid="section-nav"
				>
					{sectionNavTreeWithoutLabel?.map((parent) => (
						<StackedNavLink
							destination={parent.real_path}
							key={parent.id}
							isCurrent={parent.slug === slug ? true : false}
							nested={
								parent.childLinks?.length
									? parent.childLinks?.map((child: ExtendedSBLink) => (
											<StackedNavLink
												destination={child.real_path}
												key={child.id}
												isCurrent={child.slug === slug ? true : false}
											>
												{child.name}
											</StackedNavLink>
									  ))
									: undefined
							}
						>
							{parent.name}
						</StackedNavLink>
					))}
				</StackedNav>
			)}
		</>
	);
};
