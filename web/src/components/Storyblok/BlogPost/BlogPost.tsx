import { StoryblokComponent } from "@storyblok/react";
import React, { useEffect, useRef } from "react";
import { StoryblokStory } from "storyblok-generate-ts";
import { StoryblokRichtext } from "storyblok-rich-text-react-renderer";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Tag } from "@nice-digital/nds-tag";

import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";
import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import { AuthorStoryblok, BlogPostStoryblok } from "@/types/storyblok";
import { formatDateStr } from "@/utils/datetime";

import { AuthorList } from "../StoryblokAuthor/AuthorList/AuthorList";
import { StoryblokImage } from "../StoryblokImage/StoryblokImage";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./BlogPost.module.scss";

// overrride the default type to include the content to use the richtext renderer type
export interface RichTextBlogPostStoryblok extends BlogPostStoryblok {
	content: StoryblokRichtext;
}

export interface BlogPostProps {
	blok: RichTextBlogPostStoryblok;
	breadcrumbs?: TypeBreadcrumb[];
}

export const BlogPost = ({
	blok,
	breadcrumbs,
}: BlogPostProps): React.ReactElement => {
	const imageRef = useRef<HTMLImageElement>(null);
	const articleRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleResize = () => {
			// set the offset for the featured image
			if (articleRef.current && imageRef.current) {
				articleRef.current.style.setProperty(
					"--featuredImageOffset",
					`${Math.floor(imageRef.current.height / 1.75)}px`
				);
			}
		};

		window.addEventListener("resize", handleResize);

		//run once to set the initial value
		handleResize();

		// clear the event listener when the component is unmounted
		return () => {
			window.removeEventListener("resize", handleResize);
		};
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

	const PageHeaderFooter = () => {
		const pageType = "Blog";

		return (
			<div className="news-article__meta">
				<Tag outline data-testid="pageTag">
					{pageType}
				</Tag>{" "}
				&nbsp;
				{typeof blok.date === "string" && (
					<time dateTime={blok.date}>{formatDateStr(blok.date)}</time>
				)}
			</div>
		);
	};

	// filter out any strings from the author array
	// const mixedArray: (string | StoryblokStory<AuthorStoryblok>)[] = blok.author;
	// const filteredAuthorArray: StoryblokStory<AuthorStoryblok>[] =
	// 	mixedArray.filter(
	// 		(item) => typeof item !== "string"
	// 	) as StoryblokStory<AuthorStoryblok>[];

	//TODO: remove this when the above is fixed, mob sanitycheck
	const authors = blok.author as StoryblokStory<AuthorStoryblok>[];

	return (
		<article className={styles.article} ref={articleRef}>
			<Grid>
				<GridItem cols={12}>
					<PageHeader
						variant="fullWidthLight"
						heading={blok.title}
						lead={blok.introText}
						breadcrumbs={BreadcrumbComponent}
						description={[<PageHeaderFooter key="page-header-meta" />]}
						secondSection={<AuthorList authors={authors} />}
					/>

					{/* post content */}
					<Grid>
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
								/>
							)}
							<StoryblokRichText content={blok.content} />
						</GridItem>
					</Grid>
				</GridItem>
				<GridItem cols={12}>
					<NewsLetterSignup />
				</GridItem>
			</Grid>
		</article>
	);
};
