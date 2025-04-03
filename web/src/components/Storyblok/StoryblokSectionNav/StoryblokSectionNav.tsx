import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";
import React from "react";

type ChildLink = {
	childLinks: any;
	id: string;
	real_path: string;
	slug: string;
	name: string;
  };

  type ParentLink = {
	id: string;
	real_path: string;
	slug: string;
	name: string;
	childLinks?: ChildLink[];
  };
type StoryblokSectionNavProps = {
	parentChildTreeArray: ParentLink[];
	parentAndSiblingsElse: ChildLink[] ;
	slug: string;
};

export const StoryblokSectionNav = ({
	parentChildTreeArray,
	parentAndSiblingsElse,
	slug,
}: StoryblokSectionNavProps): JSX.Element => {
	const parentChildDataArray =
		parentAndSiblingsElse?.length === 0
			? parentChildTreeArray
			: parentAndSiblingsElse;
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
						nested={parent.childLinks?.map((child:ChildLink) => (
							<StackedNavLink
								destination={child.real_path}
								key={child.id}
								isCurrent={child.slug == slug ? true : false}
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
