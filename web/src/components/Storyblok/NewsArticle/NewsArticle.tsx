import { StoryblokComponent } from "@storyblok/react";
import { render } from "storyblok-rich-text-react-renderer";

import { StoryblokPageHeader } from "@/components/Storyblok/StoryblokPageHeader/StoryblokPageHeader";
import {
	PageHeaderStoryblok,
	type NewsArticleStoryblok,
} from "@/types/storyblok";

interface HomepageBlokProps {
	blok: NewsArticleStoryblok;
}

export const NewsArticle = ({
	blok,
}: HomepageBlokProps): React.ReactElement => {
	console.log("NewsArticle blok", blok);

	const pageHeaderBlok = {
		title: blok.title,
		summary: blok.introText,
		date: blok.date,
		_uid: blok._uid,
		component: "pageHeader",
	};

	return (
		<article>
			<StoryblokPageHeader blok={pageHeaderBlok} />

			<div className="article-container">
				<div className="article-content">
					{blok.image && <img src={`${blok.image.filename}/m/`} />}

					{render(blok.content)}
				</div>
				<aside>
					Related content
					{/* <StoryblokComponent blok={blok.relatedContent} /> */}
				</aside>
			</div>
			{/* {blok.metadata &&
				blok.metadata.length > 0 &&
				blok.metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}

			{blok.body.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))} */}
		</article>
	);
};
