import { StoryblokComponent } from "@storyblok/react";
import React from "react";
import { render } from "storyblok-rich-text-react-renderer";

import { RichtextStoryblok } from "@/types/storyblok";

import styles from "./StoryblokRichText.module.scss";

export interface StoryblokRichTextProps {
	content: RichtextStoryblok;
}

export const StoryblokRichText: React.FC<StoryblokRichTextProps> = ({
	content,
}) => {
	return (
		<div className={styles.storyblokRichTextWrapper}>
			{render(content, {
				defaultBlokResolver: (name, props) => {
					const blok = { ...props, component: name };
					return <StoryblokComponent blok={blok} key={blok._uid} />;
				},
			})}
		</div>
	);
};
