import { ISbStoryData } from "@storyblok/react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Hero } from "@nice-digital/nds-hero";

import { type HeroStoryblok } from "@/types/storyblok";

interface HeroBlokProps {
	blok: HeroStoryblok;
	breadcrumbs: {
		stories: ISbStoryData[];
	};
}

export const StoryblokHero = ({
	blok,
	breadcrumbs,
}: HeroBlokProps): React.ReactElement => {
	// TODO: Refactor this breadcrumb code, it's awful
	const crumbs: { title: string; path?: string }[] = breadcrumbs.stories.map(
		(story) => {
			return {
				title: story.name,
				path: `/${story.full_slug}`,
			};
		}
	);

	const BreadcrumbComponent = breadcrumbs?.stories?.length ? (
		<Breadcrumbs>
			{[{ title: "Home", path: "/" }, ...crumbs, { title: blok.title }].map(
				(breadcrumb) => (
					<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
						{breadcrumb.title}
					</Breadcrumb>
				)
			)}
		</Breadcrumbs>
	) : undefined;

	return (
		<Hero
			title={blok.title}
			intro={blok.intro || undefined}
			header={BreadcrumbComponent}
		/>
	);
};
