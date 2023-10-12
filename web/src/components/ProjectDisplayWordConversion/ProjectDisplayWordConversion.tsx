import { type FC } from "react";

import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PrevNext } from "@nice-digital/nds-prev-next";
import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import { niceIndevConvertedDocument } from "@/feeds/inDev/types";

import { Link } from "../Link/Link";

// import styles from "./ResourceList.module.scss";

export type ProjectDisplayWordConversionProps = niceIndevConvertedDocument & {
	currentChapter: string;
	currentUrl: string;
};

export const ProjectDisplayWordConversion: FC<
	ProjectDisplayWordConversionProps
> = ({ content, sections, currentChapter, currentUrl }) => {
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
			const prevOrNextObject = {
				text: sections[prevOrNextArrayIndex].title,
				destination: `${currentUrlNoChapter}/${sections[prevOrNextArrayIndex].slug}`,
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
			<GridItem cols={12} sm={3} elementType="section">
				<StackedNav>
					{sections.map((section, index) => {
						const destination = `${currentUrlNoChapter}/${section.slug}`;
						const isCurrentChapter =
							section.slug === currentChapter ||
							(currentChapter === "index" && index === 0);

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
			<GridItem cols={12} sm={9} elementType="section">
				<div dangerouslySetInnerHTML={{ __html: content }} />
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
