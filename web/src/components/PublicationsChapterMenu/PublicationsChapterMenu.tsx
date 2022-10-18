import Link from "next/link";
import React, { FC } from "react";

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
	const splitUrl = url.toString().toLowerCase().split("/");
	console.log(splitUrl);
	return productpath + slug + "/chapters/" + splitUrl[3];
};

//TODO active state useRoute

export const PublicationsChapterMenu: FC<ChapterHeadingsProps> = ({
	chapters,
	productType,
	slug,
}) => {
	const productPath =
		ProductTypePaths[productType as keyof typeof ProductTypePaths];

	return (
		<ul>
			{chapters.map((item, i) => {
				return (
					<li key={i}>
						<Link href={buildChapterPath(item.url, productPath, slug)}>
							<a>{item.title}</a>
						</Link>
					</li>
				);
			})}
		</ul>
	);
};
