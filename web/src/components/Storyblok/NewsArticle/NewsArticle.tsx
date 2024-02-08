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
import { formatDateStr } from "@/utils/datetime";

import { StoryblokImage } from "../StoryblokImage/StoryblokImage";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./NewsArticle.module.scss";

export interface NewsArticleProps {
	blok: SBNewsArticle;
	breadcrumbs?: TypeBreadcrumb[];
}

export const NewsArticle = ({
	blok,
	breadcrumbs,
}: NewsArticleProps): React.ReactElement => {
	const imageRef = useRef<HTMLImageElement>(null);
	const articleRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleResize = () => {
			// set the offset for the featured image
			console.log();
			if (articleRef.current && imageRef.current) {
				articleRef.current.style.setProperty(
					"--featuredImageOffset",
					`${imageRef.current.height / 1.75}px`
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
		const pageType = "News";

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
												<StoryblokComponent
													blok={resource}
													key={resource._uid}
												/>
												{blok.resources &&
													index < blok.resources.length - 1 && <hr />}
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
		</article>
	);
};
