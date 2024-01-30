import React, { HTMLProps } from "react";

import { YoutubeEmbedStoryblok } from "@/types/storyblok";

import styles from "./StoryblokYoutubeEmbed.module.scss";

export interface StoryblokYoutubeEmbedProps
	extends HTMLProps<HTMLIFrameElement> {
	blok: YoutubeEmbedStoryblok;
}
export const StoryblokYoutubeEmbed: React.FC<StoryblokYoutubeEmbedProps> = ({
	blok,
}) => {
	const { _uid, source } = blok;

	return (
		<iframe
			className={styles.youtubeEmbed}
			id={_uid}
			src={source}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
			allowFullScreen
			frameBorder="0"
		></iframe>
	);
};
