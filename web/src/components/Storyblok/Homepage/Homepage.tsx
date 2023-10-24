import { StoryblokComponent } from "@storyblok/react";

import { type HomepageStoryblok } from "@/types/storyblok";

interface HomepageBlokProps {
	blok: HomepageStoryblok;
}

export const Homepage = ({ blok }: HomepageBlokProps): React.ReactElement => {
	return (
		<>
			{blok.metadata?.length &&
				blok.metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			{blok.body.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</>
	);
};