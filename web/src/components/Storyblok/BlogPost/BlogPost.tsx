import { StoryblokComponent } from "@storyblok/react";
import React, { useEffect, useRef } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";
import { Panel } from "@nice-digital/nds-panel";
import { Tag } from "@nice-digital/nds-tag";

import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";
import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import { SBNewsArticle } from "@/types/SBNews";
import { AuthorStoryblok } from "@/types/storyblok";
import { formatDateStr } from "@/utils/datetime";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./BlogPost.module.scss";

export interface BlogPostProps {
	blok: SBNewsArticle;
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

	const AuthorList = () => {
		if (!blok.author) {
			return null;
		}

		if (blok.author && blok.author.length === 1) {
			return <StoryblokComponent blok={blok.author[0].content} />;
		} else {
			return (
				<>
					{blok.author.map((author: AuthorStoryblok) => {
						// strip the image property from the content for multiple authors
						// eslint-disable-next-line @typescript-eslint/no-unused-vars
						const { image, ...contentWithoutImage } = author.content;

						return (
							<StoryblokComponent
								key={author._uid}
								blok={contentWithoutImage}
							/>
						);
					})}
				</>
			);
		}
	};

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
						secondSection={<AuthorList />}
					/>

					{/* article content */}
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
