import { Hero } from "@nice-digital/nds-hero";

import { type HeroStoryblok } from "@/types/storyblok";

interface HeroBlokProps {
	blok: HeroStoryblok;
}

export const StoryblokHero = ({ blok }: HeroBlokProps): React.ReactElement => {
	return (
		<Hero
			title={blok.title}
			intro={blok.intro || undefined}
			header={<span>Breadcrumbs to go here</span>}
		/>
	);
};
