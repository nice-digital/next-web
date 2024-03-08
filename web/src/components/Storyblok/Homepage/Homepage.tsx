import { StoryblokComponent } from "@storyblok/react";
import { StoryblokStory } from "storyblok-generate-ts";

import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { type NewsStory } from "@/types/News";
import { type HomepageStoryblok } from "@/types/storyblok";

import styles from "./Homepage.module.scss";
import { HomepageLatestNews } from "./HomepageLatestNews/HomepageLatestNews";

interface HomepageBlokProps {
	blok: HomepageStoryblok;
	latestNews: NewsStory[];
}

export const Homepage = ({
	blok,
	latestNews,
}: HomepageBlokProps): React.ReactElement => {
	const {
		metadata,
		hero,
		featuredStory,
		links,
		primaryActionBanner,
		promoBox1,
		promoBox2,
		spotlight,
	} = blok;

	return (
		<>
			{metadata &&
				metadata.length > 0 &&
				metadata?.map((nestedBlok) => (
					<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}

			{/* Hero */}
			{hero.map((nestedBlok) => (
				<StoryblokComponent blok={nestedBlok} key={nestedBlok._uid} />
			))}

			<div className={styles.content}>
				{/* Latest news */}
				<HomepageLatestNews
					featuredStory={featuredStory as StoryblokStory<NewsStory>}
					latestNews={latestNews}
				/>

				{/* Primary action banner */}
				{primaryActionBanner &&
					primaryActionBanner.length > 0 &&
					primaryActionBanner.map((nestedBlok) => (
						<div className={styles.actionBannerWrapper} key={nestedBlok._uid}>
							<StoryblokComponent
								blok={nestedBlok}
								className={styles.actionBanner}
							/>
						</div>
					))}

				{/* Links */}
				<div className={styles.links}>
					<StoryblokRichText content={links} />
				</div>

				{/* Promo box 1 */}
				{promoBox1 &&
					promoBox1.length > 0 &&
					promoBox1.map((nestedBlok) => (
						<StoryblokComponent
							blok={nestedBlok}
							className={styles.promoBox}
							key={nestedBlok._uid}
						/>
					))}

				{/* Spotlight */}
				{spotlight &&
					spotlight.length > 0 &&
					spotlight.map((nestedBlok) => (
						<StoryblokComponent
							blok={nestedBlok}
							className={styles.spotlight}
							key={nestedBlok._uid}
						/>
					))}

				{/* Promo box 2 */}
				{promoBox2 &&
					promoBox2.length > 0 &&
					promoBox2.map((nestedBlok) => (
						<StoryblokComponent
							blok={nestedBlok}
							className={styles.promoBox}
							key={nestedBlok._uid}
						/>
					))}
			</div>
		</>
	);
};
