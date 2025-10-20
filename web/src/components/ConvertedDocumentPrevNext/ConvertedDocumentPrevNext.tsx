import { useRouter } from "next/router";
import React, { type FC } from "react";

import { PrevNext, type PrevNextLink } from "@nice-digital/nds-prev-next";

import { ScrollToContentStartLink } from "@/components/Link/Link";
import { niceIndevConvertedDocumentChapter } from "@/feeds/inDev/types";

export type ConvertedDocumentPrevNextProps = {
	chapters: niceIndevConvertedDocumentChapter[];
};

export const ConvertedDocumentPrevNext: FC<ConvertedDocumentPrevNextProps> = ({
	chapters
}) => {
	const { asPath } = useRouter();

	// strip hash from asPath due to difference between client and ssr https://github.com/vercel/next.js/issues/25202
	const currentUrl = asPath.replace(/#.*/, "");

	// find chapter slug in url string
	const currentUrlChapterSlugIndex = currentUrl.lastIndexOf(`/chapter/`);

	// remove chapter slug from url string
	const currentUrlNoChapterSlug =
		currentUrlChapterSlugIndex > -1
			? currentUrl.slice(0, currentUrlChapterSlugIndex)
			: currentUrl;

	let currentChapterArrayIndex = chapters.findIndex(
		({ slug }) => currentUrl.indexOf(`/chapter/${slug}`) > -1
	);
	currentChapterArrayIndex = currentChapterArrayIndex === -1 ? 0 : currentChapterArrayIndex;

	const nextPageLink = chapters[currentChapterArrayIndex + 1],
		previousPageLink = chapters[currentChapterArrayIndex - 1];

	const getPageLink = (
		chapter: niceIndevConvertedDocumentChapter | undefined
	): PrevNextLink | undefined => {
		const chapterSlug = chapters[0] === chapter ? "" : `/chapter/${chapter?.slug}`;
		const destination = currentUrlNoChapterSlug + chapterSlug;

		return chapter
			? {
				text: chapter.title,
				destination,
				elementType: ScrollToContentStartLink,
			}
			: undefined;
	};

	return (
		<>
			<hr />
			<PrevNext
				nextPageLink={getPageLink(nextPageLink)}
				previousPageLink={getPageLink(previousPageLink)}
			/>
		</>
	);
};
