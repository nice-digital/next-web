import React from "react";
import LiteYouTubeEmbed, { LiteYouTubeProps } from "react-lite-youtube-embed";
// import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import { YoutubeEmbedStoryblok } from "@/types/storyblok";

import styles from "./StoryblokYoutubeEmbed.module.scss";

// omitting id and title from LiteYouTubeProps as we are passing them in from the blok props
export interface StoryblokYoutubeEmbedProps
	extends Omit<LiteYouTubeProps, "id" | "title"> {
	blok: YoutubeEmbedStoryblok;
}
export const StoryblokYoutubeEmbed: React.FC<StoryblokYoutubeEmbedProps> = ({
	blok,
}) => {
	const { source, title } = blok;

	return (
		//using react-lite-youtube-embed
		<LiteYouTubeEmbed
			id={source}
			title={`(video) ${title}`}
			iframeClass={styles.youtubeIframe}
			wrapperClass={styles.youtubeWrapper}
			playerClass={styles.youtubePlayButton}
			activatedClass={styles.youtubeActivated}
			aspectHeight={9}
			aspectWidth={16}
			webp={true}
			playlist={false}
			params={"disablekb=0&rel=0&enablejsapi=0&autoplay=1"}
			rel="0"
			cookie={true}
		/>
	);
};
