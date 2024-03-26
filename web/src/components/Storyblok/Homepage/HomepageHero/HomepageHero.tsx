import { useState, useEffect } from "react";

import { Hero } from "@nice-digital/nds-hero";

import {
	ButtonLinkStoryblok,
	type HomepageHeroStoryblok,
} from "@/types/storyblok";

import { StoryblokButtonLink } from "../../StoryblokButtonLink/StoryblokButtonLink";

interface HomepageHeroBlokProps {
	blok: HomepageHeroStoryblok;
}

export const HomepageHero = ({
	blok,
}: HomepageHeroBlokProps): React.ReactNode => {
	const { title, images, description, cta } = blok;

	const [randomImage, setRandomImage] = useState("");

	// Pick an image at random
	useEffect(() => {
		const randomIndex = Math.floor(Math.random() * images.length);
		setRandomImage(`${images[randomIndex].filename}/m/`);
	}, [images]);

	// Force button to CTA variant
	const updatedCTA: ButtonLinkStoryblok = {
		...cta[0],
		variant: "cta",
	};

	return (
		<Hero
			isDark
			title={title}
			intro={description}
			image={randomImage}
			actions={<StoryblokButtonLink button={updatedCTA} />}
		/>
	);
};
