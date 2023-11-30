import { type FC } from "react";

import { Button } from "@nice-digital/nds-button";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import "@nice-digital/nds-in-page-nav/scss/in-page-nav.scss";
import { PrevNext } from "@nice-digital/nds-prev-next";
import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import {
	niceIndevConvertedDocument,
	resourceInPageNavLink,
} from "@/feeds/inDev/types";

import { Link } from "../Link/Link";

import styles from "./ProjectDisplayWordConversion.module.scss";

export type ProjectDisplayWordConversionProps = niceIndevConvertedDocument & {
	inPageNavLinks: resourceInPageNavLink[];
	currentChapter: string;
	currentUrl: string;
	resourceFileTitle: string;
};

export const ProjectDisplayWordConversion: FC<
	ProjectDisplayWordConversionProps
> = ({
	content,
	sections,
	inPageNavLinks,
	pdfLink,
	currentChapter,
	currentUrl,
	resourceFileTitle,
}) => {
	// find chapter slug in url string
	const currentUrlChapterSlugIndex = currentChapter
		? currentUrl.lastIndexOf(`/${currentChapter}`)
		: -1;

	// remove chapter slug from url string
	const currentUrlNoChapter =
		currentUrlChapterSlugIndex > -1
			? currentUrl.slice(0, currentUrlChapterSlugIndex)
			: currentUrl;

	let currentChapterArrayIndex = 0;

	// to establish previous and next chapters in pagination
	const generatePrevNextLinks = (
		prevOrNextArrayIndex: number,
		totalChapterCount: number,
		previous: boolean
	) => {
		if (prevOrNextArrayIndex >= 0 && prevOrNextArrayIndex < totalChapterCount) {
			const chapterSlug =
				prevOrNextArrayIndex === 0
					? ""
					: `/chapter/${sections[prevOrNextArrayIndex].slug}`;
			const prevOrNextObject = {
				text: sections[prevOrNextArrayIndex].title,
				destination: `${currentUrlNoChapter}${chapterSlug}`,
				elementType: Link,
			};

			return previous
				? { previousPageLink: prevOrNextObject }
				: { nextPageLink: prevOrNextObject };
		} else {
			return {};
		}
	};

	return (
		<Grid gutter="loose">
			<GridItem cols={12} md={4} lg={3} elementType="section">
				{pdfLink && (
					<Button
						aria-label="Download (PDF)"
						variant="cta"
						className={styles.download}
						to={pdfLink}
						target="_blank"
					>
						Download (PDF)
					</Button>
				)}
				<StackedNav aria-label="chapters">
					{sections.map((section, index) => {
						const chapterSlug = index === 0 ? "" : `/chapter/${section.slug}`;
						const destination = `${currentUrlNoChapter}${chapterSlug}`;
						const isCurrentChapter =
							section.slug === currentChapter ||
							(currentChapter === "" && index === 0);

						if (isCurrentChapter) currentChapterArrayIndex = index;

						return (
							<StackedNavLink
								key={section.slug}
								destination={destination}
								elementType={Link}
								isCurrent={isCurrentChapter}
							>
								{section.title}
							</StackedNavLink>
						);
					})}
				</StackedNav>
			</GridItem>
			<GridItem cols={12} md={8} lg={9} elementType="section">
				<h2 className="mt--0">{resourceFileTitle}</h2>
				{/*
					<InPageNav /> //headings contain numbers which aren't in the id, so doesn't work
					<OnThisPage sections={inPageNavLinks} /> //component needs adapting to work here
				*/}
				{inPageNavLinks.length > 0 && (
					<div className={styles.inPageNavNoScroll}>
						<nav
							className="in-page-nav in-page-nav--no-scroll"
							aria-labelledby="on-this-page"
						>
							<h2 id="on-this-page" className="in-page-nav__title">
								On this page
							</h2>
							<ol
								className="in-page-nav__list"
								aria-label="Jump to sections on this page"
							>
								{inPageNavLinks.map(
									(inPageNavLink: resourceInPageNavLink, index: number) => (
										<li className="in-page-nav__item" key={index}>
											<a
												href={`#${inPageNavLink.slug}`}
												dangerouslySetInnerHTML={{
													__html: inPageNavLink.title,
												}}
											/>
										</li>
									)
								)}
							</ol>
						</nav>
					</div>
				)}
				<div
					dangerouslySetInnerHTML={{ __html: content }}
					className={styles.chapterContent}
				/>
				<PrevNext
					{...generatePrevNextLinks(
						currentChapterArrayIndex - 1,
						sections.length,
						true
					)}
					{...generatePrevNextLinks(
						currentChapterArrayIndex + 1,
						sections.length,
						false
					)}
				/>
			</GridItem>
		</Grid>
	);
};
