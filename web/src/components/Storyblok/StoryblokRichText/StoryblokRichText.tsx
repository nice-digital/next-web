import { StoryblokComponent } from "@storyblok/react";
import React from "react";
import { render } from "storyblok-rich-text-react-renderer";

export interface StoryblokRichTextProps {
	blok: any;
}

export const StoryblokRichText = ({
	blok,
}: StoryblokRichTextProps): React.ReactElement => {
	return (
		<>
			{render(blok, {
				defaultBlokResolver: (name, props) => {
					const blok = { ...props, component: name };
					return <StoryblokComponent blok={blok} key={blok._uid} />;
				},
			})}
		</>
	);
};
