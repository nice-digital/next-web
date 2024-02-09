import { StoryblokComponent, renderRichText } from "@storyblok/react";

import { type InfoPageStoryblok } from "@/types/storyblok";

interface InfoPageBlokProps {
	blok: InfoPageStoryblok;
}

export const InfoPage = ({ blok }: InfoPageBlokProps): React.ReactElement => {
	return (
		<>
			{blok.metadata &&
				blok.metadata.length > 0 &&
				blok.metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			{blok.header.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}
			{renderRichText(blok.content)}
		</>
	);
};
