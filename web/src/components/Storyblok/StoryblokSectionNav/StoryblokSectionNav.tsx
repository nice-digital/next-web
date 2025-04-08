import React from "react";

import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

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
	parentAndSiblingLinksElse: Link[];
	slug: string;
};

export const StoryblokSectionNav = ({
	parentChildLinksTreeArray,
	parentAndSiblingLinksElse,
	slug,
}: StoryblokSectionNavProps): JSX.Element => {
	const parentChildDataArray =
		parentAndSiblingLinksElse?.length === 0
			? parentChildLinksTreeArray
			: parentAndSiblingLinksElse;
	const parentChildDataWithFirstElement = parentChildDataArray[0];
	const trimmedParentChildData =
		parentChildDataArray?.length > 0 ? parentChildDataArray.slice(1) : [];
	return (
		<>
			<StackedNav label={parentChildDataWithFirstElement?.name}>
				{trimmedParentChildData?.map((parent) => (
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
