import { useRouter } from "next/router";
import React, { FC } from "react";

import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import { ScrollToContentStartLink } from "@/components/Link/Link";
import { ChapterHeading } from "@/feeds/publications/types";

export type PublicationsChapterMenuProps = {
	ariaLabel: string;
	chapters: ChapterHeading[];
};

export const PublicationsChapterMenu: FC<PublicationsChapterMenuProps> = ({
	ariaLabel,
	chapters,
}) => {
	const router = useRouter();

	return (
		<StackedNav aria-label={ariaLabel}>
			{chapters.map((item) => {
				const destination = item.url;
				return (
					<StackedNavLink
						key={item.url}
						destination={destination}
						elementType={ScrollToContentStartLink}
						isCurrent={destination === router.asPath}
					>
						<span dangerouslySetInnerHTML={{ __html: item.title }} />
					</StackedNavLink>
				);
			})}
		</StackedNav>
	);
};
