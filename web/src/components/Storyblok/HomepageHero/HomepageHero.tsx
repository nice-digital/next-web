import { Hero } from "@nice-digital/nds-hero";

import { type HomepageHeroStoryblok } from "@/types/storyblok";

interface HomepageHeroBlokProps {
	blok: HomepageHeroStoryblok;
}

export const HomepageHero = ({
	blok,
}: HomepageHeroBlokProps): React.ReactNode => {
	const { title } = blok;

	return <Hero title={title} />;
};
