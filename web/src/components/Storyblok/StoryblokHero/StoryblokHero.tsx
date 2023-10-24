import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Hero } from "@nice-digital/nds-hero";

import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import { type HeroStoryblok } from "@/types/storyblok";

interface HeroBlokProps {
	blok: HeroStoryblok;
	breadcrumbs?: TypeBreadcrumb[];
}

export const StoryblokHero = ({
	blok,
	breadcrumbs,
}: HeroBlokProps): React.ReactElement => {
	const BreadcrumbComponent = breadcrumbs?.length ? (
		<Breadcrumbs>
			{[{ title: "Home", path: "/" }, ...breadcrumbs].map((breadcrumb) => (
				<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
					{breadcrumb.title}
				</Breadcrumb>
			))}
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