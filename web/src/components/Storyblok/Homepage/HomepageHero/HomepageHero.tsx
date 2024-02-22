import { useState, useEffect } from "react";

import { Button } from "@nice-digital/nds-button";
import { Hero } from "@nice-digital/nds-hero";

import { type HomepageHeroStoryblok } from "@/types/storyblok";

interface HomepageHeroBlokProps {
	blok: HomepageHeroStoryblok;
}

export const HomepageHero = ({
	blok,
}: HomepageHeroBlokProps): React.ReactNode => {
	const { title, images, description, ctaLink, ctaText } = blok;

	const [randomImage, setRandomImage] = useState("");

	// Pick an image at random
	useEffect(() => {
		const randomIndex = Math.floor(Math.random() * images.length);
		setRandomImage(`${images[randomIndex].filename}/m/`);
	}, [images]);

	return (
		<Hero
			isDark
			title={title}
			intro={description}
			image={randomImage}
			actions={
				<Button variant="cta" to={`/${ctaLink.cached_url}`}>
					{ctaText}
				</Button>
			}
		/>
	);
};
