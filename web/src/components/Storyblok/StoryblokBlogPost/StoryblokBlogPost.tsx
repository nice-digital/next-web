import { debounce } from "lodash";
import React, { useEffect, useRef } from "react";
import { StoryblokStory } from "storyblok-generate-ts";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";

import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";
import { Metadata } from "@/components/Storyblok/Metadata/Metadata";
import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import {
	type AuthorStoryblok,
	type BlogPostStoryblok,
} from "@/types/storyblok";

import { NewsPageHeaderFooter } from "../NewsPageHeader/NewsPageHeaderFooter/NewsPageHeaderFooter";
import { AuthorList } from "../StoryblokAuthor/AuthorList/AuthorList";
import { StoryblokAuthor } from "../StoryblokAuthor/StoryblokAuthor";
import { StoryblokImage } from "../StoryblokImage/StoryblokImage";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./StoryblokBlogPost.module.scss";

export interface StoryblokBlogPostProps {
	blok: BlogPostStoryblok;
	breadcrumbs?: TypeBreadcrumb[];
}

export const StoryblokBlogPost = ({
	blok,
	breadcrumbs,
}: StoryblokBlogPostProps): React.ReactElement => {
	const imageRef = useRef<HTMLImageElement>(null);
	const articleRef = useRef<HTMLDivElement>(null);
	const { author } = blok;

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
	});

	const BreadcrumbComponent = breadcrumbs?.length ? (
		<Breadcrumbs className="">
			{breadcrumbs.map((breadcrumb) => (
				<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
					{breadcrumb.title}
				</Breadcrumb>
			))}
		</Breadcrumbs>
	) : undefined;

	const authors = author as StoryblokStory<AuthorStoryblok>[];

	const PageHeaderAuthorsList =
		authors.length === 0 ? null : authors.length > 1 ? (
			<div className={styles.authorSection}>
				<AuthorList authors={authors} />
			</div>
		) : typeof blok.author[0] !== "string" ? (
			<div className={styles.authorSection}>
				<StoryblokAuthor blok={blok.author[0].content} headingLevel={2} />
			</div>
		) : null;

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
						secondSection={PageHeaderAuthorsList}
						verticalPadding="loose"
					/>
				</GridItem>

				{/* post content */}
				<GridItem cols={12} md={{ cols: 7 }}>
					{blok.image && (
						<StoryblokImage
							ref={imageRef}
							alt={blok.image.alt}
							className={styles.featuredImage}
							height="428px"
							loading="eager"
							src={blok.image.filename}
							serviceOptions={{
								height: 0,
								quality: 80,
								width: 867,
							}}
							width="760px"
						/>
					)}
					<StoryblokRichText content={blok.content} />
				</GridItem>
				{/* action banner signup */}
				<GridItem cols={12}>
					<NewsLetterSignup />
				</GridItem>
			</Grid>
		</article>
	);
};
