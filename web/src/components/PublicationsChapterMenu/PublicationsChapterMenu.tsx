import { useRouter } from "next/router";
import React, { FC } from "react";

import { StackedNav, StackedNavLink } from "@nice-digital/nds-stacked-nav";

import { Link } from "@/components/Link/Link";
import { ProductChapter } from "@/feeds/publications/types";

export type ChapterHeadingsProps = {
	chapters: ProductChapter[];
	productType: string;
	slug: string;
};

export enum ProductTypePaths {
	IND = "/indicators/",
}

const buildChapterPath = (url: string, productpath: string, slug: string) => {
	return `${productpath}${slug}/chapters/${
		url.toString().toLowerCase().split("/")[3]
	}`;
};

export const PublicationsChapterMenu: FC<ChapterHeadingsProps> = ({
	chapters,
	productType,
	slug,
}) => {
	console.log({ chapters });
	const router = useRouter();
	const productPath =
		ProductTypePaths[productType as keyof typeof ProductTypePaths];

	return (
		<>
			{/* TODO accessibility attributes etc on wrapper component */}
			<StackedNav>
				{chapters.map((item) => {
					const destination = buildChapterPath(item.url, productPath, slug);
					console.log({ router });
					return (
						<StackedNavLink
							key={item.url}
							destination={destination}
							elementType={Link}
							isCurrent={destination === router.asPath}
						>
							<span dangerouslySetInnerHTML={{ __html: item.title }} />
						</StackedNavLink>
					);
				})}
			</StackedNav>
		</>
	);
};
