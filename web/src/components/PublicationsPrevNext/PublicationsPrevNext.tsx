import { useRouter } from "next/router";
import React, { type FC } from "react";

import { PrevNext, type PrevNextLink } from "@nice-digital/nds-prev-next";

import { ScrollToContentStartLink } from "@/components/Link/Link";
import { type ChapterHeading } from "@/feeds/publications/types";
import { useIsClient } from "@/hooks/useIsClient";

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
	const isClient = useIsClient();
	const currentIndex = chapters.findIndex(({ url }) => url === asPath),
		nextPageLink = chapters[currentIndex + 1],
		previousPageLink = chapters[currentIndex - 1];

	return (
		<>
			{isClient && (
				<PrevNext
					nextPageLink={getPageLink(nextPageLink)}
					previousPageLink={getPageLink(previousPageLink)}
				/>
			)}
		</>
	);
};
