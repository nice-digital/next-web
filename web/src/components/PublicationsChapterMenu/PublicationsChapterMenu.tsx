import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";

import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import { Link } from "@/components/Link/Link";
import { ChapterHeading } from "@/feeds/publications/types";
import { useIsClient } from "@/hooks/useIsClient";

export type PublicationsChapterMenuProps = {
	ariaLabel: string;
	chapters: ChapterHeading[];
};

export const PublicationsChapterMenu: FC<PublicationsChapterMenuProps> = ({
	ariaLabel,
	chapters,
}) => {
	const router = useRouter();
	const isClient = useIsClient();

	return (
		<>
			{isClient && (
				<StackedNav aria-label={ariaLabel}>
					{chapters.map((item) => {
						const destination = item.url;

						return (
							<StackedNavLink
								key={item.url}
								destination={destination}
								elementType={Link}
								// isCurrent={destination === router.asPath}
								isCurrent={
									isClient
										? destination === router.asPath.split("#", 1)[0]
										: destination === router.asPath
								}
							>
								<span dangerouslySetInnerHTML={{ __html: item.title }} />
							</StackedNavLink>
						);
					})}
				</StackedNav>
			)}
		</>
	);
};
