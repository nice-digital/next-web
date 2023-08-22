import { StoryblokComponent, StoryblokComponentType } from "@storyblok/react";

interface HomepageBlokProps {
	blok: {
		body: StoryblokComponentType<"homepage">[];
	};
}

export const Homepage = ({ blok }: HomepageBlokProps): React.ReactElement => {
	return (
		<>
			{blok.body.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</>
	);
};
