import { StoryblokComponent } from "@storyblok/react";
import React, { Children, isValidElement } from "react";
import {
	NODE_IMAGE,
	NODE_PARAGRAPH,
	NODE_QUOTE,
	render,
	StoryblokRichtext,
} from "storyblok-rich-text-react-renderer";

import blockquoteStyles from "@/components/Storyblok/Blockquote/Blockquote.module.scss";
import { RichtextStoryblok } from "@/types/storyblok";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";

import styles from "./StoryblokRichText.module.scss";

export interface StoryblokRichTextProps {
	content: StoryblokRichtext;
}

export const StoryblokRichText: React.FC<StoryblokRichTextProps> = ({
	content,
}) => {
	return (
		<div
			className={styles.storyblokRichTextWrapper}
			data-testid="storyblok-rich-text"
		>
			{render(content, {
				nodeResolvers: {
					[NODE_PARAGRAPH]: (children) => {
						// stops images being wrapped in a paragraph tag
						if (Children.count(children) === 1) {
							const child = Children.toArray(children)[0];

							if (isValidElement(child) && child?.type === StoryblokImage) {
								return <React.Fragment>{child}</React.Fragment>;
							}
						}

						// if the paragraph is empty, don't render it
						if (children === null) {
							return null;
						}

						return <p>{children}</p>;
					},
					[NODE_IMAGE]: (children, props) => {
						// renders inline images from the stories richText field to StoryblokImage component
						return (
							<StoryblokImage src={props.src} alt={props.alt} loading="lazy" />
						);
					},
					[NODE_QUOTE]: (children) => {
						// workaround: hardcoded blockquote component
						//TODO: refactor this workaround to handle inline quotes in the richtext field of the storyblok editor
						return (
							<figure className={blockquoteStyles.quote}>
								<blockquote>{children}</blockquote>
							</figure>
						);
					},
				},
				defaultBlokResolver: (name, props) => {
					// resolves all other storyblok components to permissoned components
					const blok = { ...props, component: name };
					return <StoryblokComponent blok={blok} key={blok._uid} />;
				},
			})}
		</div>
	);
};
