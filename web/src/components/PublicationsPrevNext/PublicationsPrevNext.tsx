import { useRouter } from "next/router";
import React, { type FC } from "react";

import { PrevNext, type PrevNextLink } from "@nice-digital/nds-prev-next";

import { ScrollToContentStartLink } from "@/components/Link/Link";
import { type ChapterHeading } from "@/feeds/publications/types";

export type PublicationsPrevNextProps = {
	chapters: ChapterHeading[];
};

const getPageLink = (
	chapter: ChapterHeading | undefined
): PrevNextLink | undefined =>
	chapter
		? {
				text: chapter.title,
				destination: chapter.url,
				elementType: ScrollToContentStartLink,
		  }
		: undefined;

export const PublicationsPrevNext: FC<PublicationsPrevNextProps> = ({
	chapters,
}) => {
	const { asPath } = useRouter();

	// strip hash from asPath due to difference between client and ssr https://github.com/vercel/next.js/issues/25202
	const currentIndex = chapters.findIndex(
			({ url }) => url === asPath.replace(/#.*/, "")
		),
		nextPageLink = chapters[currentIndex + 1],
		previousPageLink = chapters[currentIndex - 1];

	return (
		<PrevNext
			nextPageLink={getPageLink(nextPageLink)}
			previousPageLink={getPageLink(previousPageLink)}
		/>
	);
};
