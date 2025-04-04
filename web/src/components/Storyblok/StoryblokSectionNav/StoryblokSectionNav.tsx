import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";
import React from "react";

type ChildLink = {
	childLinks?: any;
	id: number;
	real_path: string;
	slug: string;
	name: string;
};

type ParentLink = {
	id: number;
	real_path: string;
	slug: string;
	name: string;
	childLinks?: ChildLink[];
};
type StoryblokSectionNavProps = {
	parentChildLinksTreeArray: ParentLink[];
	parentAndSiblingLinksElse: ChildLink[];
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
			<StackedNav label={parentChildDataWithFirstElement.name}>
				{trimmedParentChildData?.map((parent) => (
					<StackedNavLink
						destination={parent.real_path}
						key={parent.id}
						isCurrent={parent.slug === slug ? true : false}
						nested={parent.childLinks?.map((child: ChildLink) => (
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
