import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Hero } from "@nice-digital/nds-hero";

import { StoryblokButtonLink } from "@/components/Storyblok/StoryblokButtonLink/StoryblokButtonLink";
import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import { type HeroStoryblok } from "@/types/storyblok";
import { constructStoryblokImageSrc } from "@/utils/storyblok";

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
			{breadcrumbs.map((breadcrumb) => (
				<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
					{breadcrumb.title}
				</Breadcrumb>
			))}
		</Breadcrumbs>
	) : undefined;

	const optimisedImage = image?.filename
		? constructStoryblokImageSrc(image?.filename)
		: undefined;

	const action = cta?.length ? (
		<StoryblokButtonLink button={cta[0]} />
	) : undefined;

	return (
		<Hero
			title={blok.title}
			intro={blok.summary || undefined}
			description={blok.description || undefined}
			header={BreadcrumbComponent}
			image={optimisedImage}
			actions={action}
		/>
	);
};
