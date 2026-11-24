import { StoryblokComponent } from "@storyblok/react";
import classnames from "classnames";
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

import { Figure } from "../Figure/Figure";
import { getCaption } from "../Figure/figureCaption";
import { StoryblokImage } from "../StoryblokImage/StoryblokImage";

import styles from "./StoryblokRichText.module.scss";

const isFigure = (node: ReactNode): boolean =>
	isValidElement(node) && node.type === Figure;

// A run of nodes left either side of an image that renders nothing visible:
// whitespace-only text and line breaks.
const isBlankRun = (nodes: ReactNode[]): boolean =>
	nodes.every(
		(node) =>
			(typeof node === "string" && node.trim().length === 0) ||
			(isValidElement(node) && node.type === "br")
	);

/**
 * Image nodes render as a <figure>, which isn't valid inside a <p> or a heading
 * (React warns about the DOM nesting in dev and, in production, the browser
 * closes the element early when parsing the server HTML, which can cause a
 * hydration mismatch). Editors can put an image in the same paragraph or heading
 * as other content, so split the block around each figure: figures are emitted as
 * siblings and each run of other content is wrapped in its own block element, e.g.
 * text, image, text becomes <p>text</p><figure/><p>text</p>.
 *
 * Blocks without a figure are wrapped exactly as before. Adjacent block margins
 * collapse, so spacing around the figure is unchanged.
 */
const splitAroundFigures = (
	children: ReactNode,
	wrap: (content: ReactNode, key?: string) => JSX.Element
): JSX.Element => {
	const nodes = Children.toArray(children);

	if (!nodes.some(isFigure)) {
		return wrap(children);
	}

	const blocks: ReactNode[] = [];
	let run: ReactNode[] = [];

	const flush = () => {
		if (run.length > 0 && !isBlankRun(run)) {
			blocks.push(wrap(run, `block-${blocks.length}`));
		}
		run = [];
	};

	nodes.forEach((node) => {
		if (isFigure(node)) {
			flush();
			blocks.push(node);
		} else {
			run.push(node);
		}
	});
	flush();

	return <React.Fragment>{blocks}</React.Fragment>;
};

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
	const classes = classnames([styles.storyblokRichTextWrapper, className]);

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

						// an image inside a heading is split out so the figure isn't
						// nested in the heading element
						return splitAroundFigures(children, (content, key) =>
							createElement(
								`h${level}`,
								{ className: `sbRichtextHeading${level}`, key },
								content
							)
						);
					},
					[NODE_PARAGRAPH]: (children) => {
						// if the paragraph is empty, don't render it
						if (children === null) {
							return null;
						}

						// Stops images being wrapped in a paragraph tag: a paragraph that
						// only holds an image renders just the figure, and an image mixed
						// with other content is split out of the paragraph.
						return splitAroundFigures(children, (content, key) => (
							<p key={key}>{content}</p>
						));
					},
					[NODE_IMAGE]: (children, props) => {
						// renders inline images from the stories richText field to StoryblokImage component
						// Assumes the image will fall below the fold and uses lazy loading
						// Assumes we're currently in the context of main body content so will use the main image max size in 7 column layout max width: 867px
						const dimensions = {
							width: props.src ? props.src.split("/")[5].split("x")[0] : 16,
							height: props.src ? props.src.split("/")[5].split("x")[1] : 9,
						};

						// Captions are rendered from the image title whenever the
						// trimmed title is non-empty; an empty/whitespace title omits
						// the figcaption.
						const caption = getCaption(props.title);

						return (
							<Figure caption={caption} inContent>
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
							</Figure>
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
