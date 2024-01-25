import { StoryblokComponent } from "@storyblok/react";
import { render } from "storyblok-rich-text-react-renderer";

import { StoryblokPageHeader } from "@/components/Storyblok/StoryblokPageHeader/StoryblokPageHeader";
import {
	PageHeaderStoryblok,
	type NewsArticleStoryblok,
	type BlogPostStoryblok,
} from "@/types/storyblok";

import styles from "./BlogPost.module.scss";

interface BlogPostProps {
	blok: BlogPostStoryblok;
}

export const BlogPost = ({ blok }: BlogPostProps): React.ReactElement => {
	// console.log("BlogPost blok", blok);

	const pageHeaderBlok = {
		title: blok.title,
		summary: blok.introText,
		date: blok.date,
		pageType: blok.component,
		_uid: blok._uid,
		component: "pageHeader",
	};

	return (
		<article>
			<StoryblokPageHeader blok={pageHeaderBlok} />

			<div className={styles.articleContainer}>
				<div className={styles.articleContent}>
					{blok.image && (
						<img
							className={styles.featuredImage}
							src={`${blok.image.filename}/m/`}
							alt={blok.image.alt}
						/>
					)}

					{render(blok.content, {
						defaultBlokResolver: (name, props) => {
							const blok = { ...props, component: name };
							return <StoryblokComponent blok={blok} />;
						},
					})}
				</div>
			</div>
		</article>
	);
};
