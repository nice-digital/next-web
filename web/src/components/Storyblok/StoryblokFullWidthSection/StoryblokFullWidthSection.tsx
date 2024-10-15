import { StoryblokComponent } from "@storyblok/react";

import { Container } from "@nice-digital/nds-container";

import { FullWidthSectionStoryblok } from "@/types/storyblok";

import styles from "./StoryblokFullWidthSection.module.scss";

export interface StoryblokFullWidthSectionProps {
	blok: FullWidthSectionStoryblok;
	className?: string;
}

export const StoryblokFullWidthSection: React.FC<
	StoryblokFullWidthSectionProps
> = ({ blok, className = undefined }: StoryblokFullWidthSectionProps) => {
	const { heading, theme, showHeading, lead, content } = blok;
	//TODO: add className based on theme
	//TODO: handle lead as Richtext
	//TODO: handle nested content bloks
	console.log({ blok });
	console.log(JSON.stringify(content));
	return (
		<div className={styles.fullWidth}>
			<Container>
				{showHeading && (
					<>
						{heading && <h2>{heading}</h2>}
						{/* {lead && <p>{lead}</p>} */}
					</>
				)}
				{content &&
					content.map((nestedBlok) => (
						<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
					))}
			</Container>
		</div>
	);
};
