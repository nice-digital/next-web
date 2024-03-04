import React, { useEffect, useRef } from "react";
import { StoryblokStory } from "storyblok-generate-ts";
import { StoryblokRichtext } from "storyblok-rich-text-react-renderer";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";

import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";
import { useFeaturedImageOffset } from "@/hooks/useFeaturedImageOffset";
import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import {
	type AuthorStoryblok,
	type BlogPostStoryblok,
} from "@/types/storyblok";

import { NewsPageHeaderFooter } from "../NewsPageHeader/NewsPageHeaderFooter/NewsPageHeaderFooter";
import { AuthorList } from "../StoryblokAuthor/AuthorList/AuthorList";
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

	const { paddingBottom, marginTop } = useFeaturedImageOffset({
		imageRef,
		ratio: 1.75,
		debounceDelay: 200,
	});

	const BreadcrumbComponent = breadcrumbs?.length ? (
		<Breadcrumbs className="">
			{[{ title: "Home", path: "/" }, ...breadcrumbs].map((breadcrumb) => (
				<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
					{breadcrumb.title}
				</Breadcrumb>
			))}
		</Breadcrumbs>
	) : undefined;

	const authors = blok.author as StoryblokStory<AuthorStoryblok>[];

	return (
		<article className={styles.newsSectionArticle} ref={articleRef}>
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
						secondSection={<AuthorList authors={authors} />}
						style={{ paddingBottom }}
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
							width="760px"
							style={{ marginTop }}
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
