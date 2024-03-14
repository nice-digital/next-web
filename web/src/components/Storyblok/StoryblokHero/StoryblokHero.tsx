import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Hero } from "@nice-digital/nds-hero";

import { StoryblokButtonLink } from "@/components/Storyblok/StoryblokButtonLink/StoryblokButtonLink";
import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import { type HeroStoryblok } from "@/types/storyblok";

export interface HeroBlokProps {
	blok: HeroStoryblok;
	breadcrumbs?: TypeBreadcrumb[];
}

export const StoryblokHero = ({
	blok,
	breadcrumbs,
}: HeroBlokProps): React.ReactElement => {
	const { image, cta } = blok;

	const BreadcrumbComponent = breadcrumbs?.length ? (
		<Breadcrumbs>
			{[{ title: "Home", path: "/" }, ...breadcrumbs].map((breadcrumb) => (
				<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
					{breadcrumb.title}
				</Breadcrumb>
			))}
		</Breadcrumbs>
	) : undefined;

	const imageUrl = `${image?.filename}/m/` || undefined;

	const action = cta?.length ? (
		<StoryblokButtonLink button={cta[0]} />
	) : undefined;

	return (
		<Hero
			title={blok.title}
			intro={blok.summary || undefined}
			header={BreadcrumbComponent}
			image={imageUrl}
			actions={action}
		/>
	);
};
