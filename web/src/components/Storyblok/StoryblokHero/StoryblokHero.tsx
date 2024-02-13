import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Button } from "@nice-digital/nds-button";
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

	//test using storyblok image service to serve webp images
	const imageUrl = `${blok.image?.filename}/m/` || undefined;

	const Action =
		blok.ctaLink && blok.ctaText ? (
			<Button to={blok.ctaLink.url} variant="secondary">
				{blok.ctaText}
			</Button>
		) : undefined;

	return (
		<Hero
			title={blok.title}
			intro={blok.summary || undefined}
			header={BreadcrumbComponent}
			image={imageUrl}
			actions={Action}
		/>
	);
};
