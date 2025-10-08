import { StoryblokComponent } from "@storyblok/react";
import React, {
	createElement,
	ReactNode,
	Children,
	isValidElement,
} from "react";
import {
	NODE_HEADING,
	NODE_IMAGE,
	NODE_PARAGRAPH,
	NODE_QUOTE,
	render,
} from "storyblok-rich-text-react-renderer";

import blockquoteStyles from "@/components/Storyblok/Blockquote/Blockquote.module.scss";
import { type RichtextStoryblok } from "@/types/storyblok";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";

import styles from "./StoryblokRichText.module.scss";

export interface StoryblokRichTextProps {
	content: RichtextStoryblok;
	className?: string;
	pageType?: string; // Added pageType prop
}

export const StoryblokRichText: React.FC<StoryblokRichTextProps> = ({
	content,
	className,
	pageType,
}) => {
	//TODO: expand to handle other pageTypes so we can target RichText blok in it's page context
	const isInfoPageClass =
		pageType === "infoPage" ? styles.isInfoPage : undefined;

	const classes = [
		styles.storyblokRichTextWrapper,
		isInfoPageClass,
		className,
	].join(" ");
	const imageClassName = [styles.imageMain, className].join(" ");
	return (
		<div className={classes} data-testid="storyblok-rich-text">
			{render(content, {
				nodeResolvers: {
					[NODE_HEADING]: (
						children: ReactNode,
						props: { level: 1 | 2 | 3 | 4 | 5 | 6 }
					) => {
						// if the heading is empty, don't render it
						if (children === null) {
							return null;
						}
						const { level } = props;

						return createElement(
							`h${level}`,
							{ className: `sbRichtextHeading${level}` },
							children
						);
					},
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
						// Assumes the image will fall below the fold and uses lazy loading
						// Assumes we're currently in the context of main body content so will use the main image max size in 7 column layout max width: 867px
						const dimensions = {
							width: props.src ? props.src.split("/")[5].split("x")[0] : 16,
							height: props.src ? props.src.split("/")[5].split("x")[1] : 9,
						};

						return (
							<StoryblokImage
								src={props.src}
								alt={props.alt}
								loading="lazy"
								className={imageClassName}
								serviceOptions={{
									height: 0,
									width: Number(dimensions.width),
									quality: 80,
								}}
								style={{
									aspectRatio: `${dimensions.width}/${dimensions.height}`,
								}}
								width={Number(dimensions.width)}
								height={Number(dimensions.height)}
							/>
						);
					},
					[NODE_QUOTE]: (children) => {
						// workaround: hardcoded blockquote component

						return (
							<figure className={blockquoteStyles.quote}>
								<blockquote>{children}</blockquote>
							</figure>
						);
					},
				},
				defaultBlokResolver: (name, props) => {
					// resolves all other storyblok components to permissable components
					const blok = { ...props, component: name };
					return (
						<StoryblokComponent
							blok={blok}
							key={blok._uid}
							pageType={pageType}
						/>
					);
				},
			})}
		</div>
	);
};
