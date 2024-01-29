import { StoryblokComponent } from "@storyblok/react";
import React from "react";
import { render } from "storyblok-rich-text-react-renderer";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { Panel } from "@nice-digital/nds-panel";

import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";
import { StoryblokPageHeader } from "@/components/Storyblok/StoryblokPageHeader/StoryblokPageHeader";
import { type Breadcrumb as Breadcrumbtype } from "@/types/Breadcrumb";
import {
	PageHeaderStoryblok,
	type NewsArticleStoryblok,
} from "@/types/storyblok";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./NewsArticle.module.scss";

interface NewsArticleProps {
	blok: NewsArticleStoryblok;
	breadcrumbs?: Breadcrumbtype[];
}

export const NewsArticle = ({ blok }: NewsArticleProps): React.ReactElement => {
	const pageHeaderBlok: PageHeaderStoryblok = {
		title: blok.title,
		summary: blok.introText,
		date: blok.date,
		pageType: blok.component,
		_uid: blok._uid,
		component: "pageHeader",
	};

	const NewsArticleBreadCrumbs = () => {
		return (
			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/news">News</Breadcrumb>
				<Breadcrumb to="/news/articles">Articles</Breadcrumb>
			</Breadcrumbs>
		);
	};

	return (
		<Grid elementType="article" className={styles.article}>
			<GridItem cols={12}>
				{/* article page header */}
				<StoryblokPageHeader
					blok={pageHeaderBlok}
					breadcrumbs={<NewsArticleBreadCrumbs />}
				/>

				{/* article content */}
				<Grid>
					<GridItem cols={12} md={{ cols: 7 }}>
						{blok.image && (
							<StoryblokImage
								className={styles.featuredImage}
								src={blok?.image?.filename}
								alt={blok.image.alt}
								height="760px"
								width="428px"
								loading="eager"
							/>
						)}
						{/* renders content from newsAtricles richText field */}
						{/* {render(blok.content, {
							defaultBlokResolver: (name, props) => {
								const blok = { ...props, component: name };
								return <StoryblokComponent blok={blok} key={blok._uid} />;
							},
						})} */}
						<StoryblokRichText blok={blok.content} />
					</GridItem>

					{/* article sidebar */}
					<GridItem
						cols={12}
						md={{ cols: 4, push: 1 }}
						elementType="aside"
						className={styles.articleSidebar}
					>
						{blok.resources && blok.resources.length > 0 && (
							<Panel variant="primary" key="resources">
								<h2 className="h5">Associated guidance and resources</h2>
								{blok.resources.map((resource) => {
									return (
										<StoryblokComponent blok={resource} key={resource._uid} />
									);
								})}
							</Panel>
						)}

						{blok.relatedNews && blok.relatedNews.length > 0 && (
							<Panel key="news">
								<h2 className="h5">Related news stories</h2>
								{blok.relatedNews?.map((news, index) => {
									return (
										<React.Fragment key={news._uid}>
											<StoryblokComponent blok={news} />
											{blok.relatedNews &&
												index < blok.relatedNews.length - 1 && <hr />}
										</React.Fragment>
									);
								})}
							</Panel>
						)}
					</GridItem>
				</Grid>
			</GridItem>
			<GridItem cols={12}>
				<NewsLetterSignup />
			</GridItem>
		</Grid>
	);
};