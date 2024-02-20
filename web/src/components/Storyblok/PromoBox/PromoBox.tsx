import Link from "next/link";

import { Button } from "@nice-digital/nds-button";

import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { type PromoBoxStoryblok } from "@/types/storyblok";

import styles from "./PromoBox.module.scss";

interface PromoBoxProps {
	blok: PromoBoxStoryblok;
}

export const PromoBox: React.FC<PromoBoxProps> = ({ blok }: PromoBoxProps) => {
	const {
		heading,
		body,
		ctaLink,
		ctaText,
		image,
		swapMediaSide,
		useVideo,
		youtubeEmbed,
	} = blok;

	const classes = swapMediaSide
		? `${styles.promoBox} ${styles.swapMediaSide}`
		: styles.promoBox;

	const showCTA = ctaLink && ctaText;

	return (
		<div className={classes}>
			<div className={styles.contentContainer}>
				<h2>{heading}</h2>
				{body && <StoryblokRichText content={body} />}
				{showCTA && (
					<Button
						variant="cta"
						to={`/${ctaLink.cached_url}`}
						elementType={Link}
						method="href"
					>
						{ctaText}
					</Button>
				)}
			</div>
			<div className={styles.mediaContainer}>
				{useVideo ? (
					<p>TODO: insert youtubeEmbed</p>
				) : (
					<p>TODO: insert image</p>
				)}
			</div>
		</div>
	);
};
