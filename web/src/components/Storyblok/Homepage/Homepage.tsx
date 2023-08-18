import { ISbStoryData, StoryblokComponent } from "@storyblok/react";

interface HomepageBlokProps {
	blok: {
		body: ISbStoryData[];
	};
}

export const Homepage = ({ blok }: HomepageBlokProps): React.ReactElement => {
	console.log("Home blok:", blok);
	return (
		<>
			{blok.body.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
		</>
	);
};
