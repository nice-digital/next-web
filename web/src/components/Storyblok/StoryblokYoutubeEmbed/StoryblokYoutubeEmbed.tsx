import { YouTubeEmbed } from "@next/third-parties/google";
import React, { HTMLProps } from "react";
import LiteYouTubeEmbed, { LiteYouTubeProps } from "react-lite-youtube-embed";
// import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

import { YoutubeEmbedStoryblok } from "@/types/storyblok";

import styles from "./StoryblokYoutubeEmbed.module.scss";

export interface StoryblokYoutubeEmbedProps
	extends HTMLProps<HTMLIFrameElement> {
	blok: YoutubeEmbedStoryblok;
}
export const StoryblokYoutubeEmbed: React.FC<StoryblokYoutubeEmbedProps> = ({
	blok,
}) => {
	const { _uid, source, title } = blok;
	{
		/** TODO: add title field to the youTubeEmbed blok so we can add a accessible title for screen reader users
		 * https://accessibility.blog.gov.uk/2020/03/16/why-videos-on-gov-uk-use-the-youtube-video-player/
		 *
		 * TODO: check the allow attribute properties are correct
		 */
	}
	return (
		//react-lite-youtube-embed
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
			announce={`(video) ${title}`}
			playlist={false}
			params={"disablekb=0"}
		/>

		//NextJS YouTubeEmbed component
		// <YouTubeEmbed videoid={source} playlabel={`(video) ${title}`} />

		// standard iframe
		// <iframe
		// 	title={`(video) ${title}`}
		// 	className={styles.youtubeEmbed}
		// 	id={`youtube-embed-${_uid}`}
		// 	src={`https://www.youtube.com/embed/${source}`}
		// 	allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		// 	allowFullScreen
		// ></iframe>
	);
};
