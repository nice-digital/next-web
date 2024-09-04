import { StoryblokComponent } from "@storyblok/react";
import { debounce } from "lodash";
import React, { useEffect, useRef } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Panel } from "@nice-digital/nds-panel";

import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";
import { Metadata } from "@/components/Storyblok/Metadata/Metadata";
import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import { type NewsArticleStoryblok } from "@/types/storyblok";

import { NewsPageHeaderFooter } from "../NewsPageHeader/NewsPageHeaderFooter/NewsPageHeaderFooter";
import { StoryblokImage } from "../StoryblokImage/StoryblokImage";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./StoryblokNewsArticle.module.scss";

export interface StoryblokNewsArticleProps {
	blok: NewsArticleStoryblok;
	breadcrumbs?: TypeBreadcrumb[];
}

export const StoryblokNewsArticle = ({
	blok,
	breadcrumbs,
}: StoryblokNewsArticleProps): React.ReactElement => {
	const imageRef = useRef<HTMLImageElement>(null);
	const articleRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleResize = debounce(() => {
			// set the offset for the featured image
			if (articleRef.current && imageRef.current) {
				articleRef.current.style.setProperty(
					"--featuredImageOffset",
					`${Math.floor(imageRef.current.height / 1.75)}px`
				);
			}
		}, 250);

		window.addEventListener("resize", handleResize);

		//run once to set the initial value
		handleResize();

		// clear the event listener when the component is unmounted
		return () => {
			window.removeEventListener("resize", handleResize);
			handleResize.cancel();
		};
	}, []);

	const BreadcrumbComponent = breadcrumbs?.length ? (
		<Breadcrumbs className="">
			{[{ title: "Home", path: "/" }, ...breadcrumbs].map((breadcrumb) => (
				<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
					{breadcrumb.title}
				</Breadcrumb>
			))}
		</Breadcrumbs>
	) : undefined;

	return (
		<article className={styles.newsSectionArticle} ref={articleRef}>
			{blok.metadata && blok.metadata.length > 0 && (
				<Metadata blok={blok.metadata[0]} />
			)}
			<Grid>
				{/* page header */}
				<GridItem cols={12}>
					<PageHeader
						variant="fullWidthLight"
						heading={blok.title}
						lead={blok.introText}
						breadcrumbs={BreadcrumbComponent}
						description={[
							<NewsPageHeaderFooter
								key="page-header-meta"
								date={blok.date}
								pageType={blok.component}
							/>,
						]}
						verticalPadding="loose"
					/>
				</GridItem>

				{/* article content */}
				<GridItem cols={12} md={{ cols: 7 }}>
					{blok.image && (
						<StoryblokImage
							ref={imageRef}
							alt={blok.image.alt}
							className={styles.featuredImage}
							height="428px"
							loading="eager"
							src={blok?.image?.filename}
							width="760px"
							serviceOptions={{
								height: 0,
								quality: 80,
								width: 760,
							}}
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

				{/* action banner signup */}
				<GridItem cols={12}>
					<NewsLetterSignup />
				</GridItem>
			</Grid>
		</article>
	);
};
