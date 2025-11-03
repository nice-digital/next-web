import { useRouter } from "next/router";
import React, { type FC } from "react";

import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import { Link } from "@/components/Link/Link";
import { niceIndevConvertedDocumentChapter } from "@/feeds/inDev/types";

export type ConvertedDocumentChapterMenuProps = {
	ariaLabel: string;
	chapters: niceIndevConvertedDocumentChapter[];
};

export const ConvertedDocumentChapterMenu: FC<
	ConvertedDocumentChapterMenuProps
> = ({ ariaLabel, chapters }) => {
	const { asPath } = useRouter();

	// strip hash from asPath due to difference between client and ssr https://github.com/vercel/next.js/issues/25202
	const currentUrl = asPath.replace(/#.*/, "");

	// find chapter slug in url string
	const currentUrlChapterSlugIndex = currentUrl.lastIndexOf(`/chapter/`);

	// remove chapter slug from url string
	const currentUrlNoChapter =
		currentUrlChapterSlugIndex > -1
			? currentUrl.slice(0, currentUrlChapterSlugIndex)
			: currentUrl;

	return (
		<StackedNav aria-label={ariaLabel}>
			{chapters.map((chapter, index) => {
				const chapterSlug = index === 0 ? "" : `/chapter/${chapter.slug}`;
				const destination = currentUrlNoChapter + chapterSlug;

				return (
					<StackedNavLink
						key={chapter.slug}
						destination={destination}
						elementType={Link}
						isCurrent={destination === currentUrl}
					>
						{chapter.title}
					</StackedNavLink>
				);
			})}
		</StackedNav>
	);
};
