import { useRouter } from "next/router";
import React, { FC } from "react";

import { PrevNext, PrevNextLink } from "@nice-digital/nds-prev-next";

import { ProductChapter } from "@/feeds/publications/types";

import { ScrollToLink } from "../Link/Link";

export type PublicationsPrevNextProps = {
	chapters: ProductChapter[];
};

const getPageLink = (
	chapter: ProductChapter | undefined
): PrevNextLink | undefined =>
	chapter
		? {
				text: chapter.title,
				destination: chapter.url,
				elementType: ({ children, ...props }) => (
					<ScrollToLink {...props} scrollTargetId="content-start">
						{children}
					</ScrollToLink>
				),
		  }
		: undefined;

const PublicationsPrevNext: FC<PublicationsPrevNextProps> = ({ chapters }) => {
	const { asPath } = useRouter();
	const currentIndex = chapters.findIndex(({ url }) => url === asPath),
		nextPageLink = chapters[currentIndex + 1],
		previousPageLink = chapters[currentIndex - 1];

	return (
		<PrevNext
			nextPageLink={getPageLink(nextPageLink)}
			previousPageLink={getPageLink(previousPageLink)}
		/>
	);
};

export default PublicationsPrevNext;
