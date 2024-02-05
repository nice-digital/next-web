import { StoryblokComponent } from "@storyblok/react";
import React from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { Panel } from "@nice-digital/nds-panel";

import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";
import { SBNewsArticle } from "@/types/SBNews";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./NewsArticle.module.scss";
import { NewsPageHeader } from "./NewsPageHeader";

export interface NewsArticleProps {
	blok: SBNewsArticle;
	breadcrumbs?: React.ReactElement;
}

export const NewsArticle = ({ blok }: NewsArticleProps): React.ReactElement => {
	const NewsArticleBreadCrumbs = (
		<Breadcrumbs>
			<Breadcrumb to="/">Home</Breadcrumb>
			<Breadcrumb to="/news">News</Breadcrumb>
			<Breadcrumb to="/news/articles">News articles</Breadcrumb>
		</Breadcrumbs>
	);

	return (
		<Grid elementType="article" className={styles.article}>
			<GridItem cols={12}>
				<NewsPageHeader
					heading={blok.title}
					lead={blok.introText}
					breadcrumbs={NewsArticleBreadCrumbs}
					date={blok.date}
					showFooter={true}
				/>

				{/* article content */}
				<Grid>
					<GridItem cols={12} md={{ cols: 7 }}>
						{blok.image && (
							<StoryblokImage
								alt={blok.image.alt}
								className={styles.featuredImage}
								height="428px"
								loading="eager"
								src={blok?.image?.filename}
								width="760px"
							/>
						)}
						<StoryblokRichText content={blok.content} />
					</GridItem>

					{/* article sidebar */}
					<GridItem
						className={styles.articleSidebar}
						cols={12}
						elementType="aside"
						md={{ cols: 4, push: 1 }}
					>
						{blok.resources && blok.resources.length > 0 && (
							<Panel variant="primary" key="resources">
								<h2 className="h5">Associated guidance and resources</h2>
								{blok.resources.map((resource, index) => {
									return (
										<React.Fragment key={resource._uid}>
											<StoryblokComponent blok={resource} key={resource._uid} />
											{blok.resources && index < blok.resources.length - 1 && (
												<hr />
											)}
										</React.Fragment>
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
