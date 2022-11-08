import { HTMLChapterSectionInfo } from "@/feeds/publications/types";

import styles from "./PublicationsChapterSectionList.module.scss";

export type ChapterSectionsListProps = {
	sections: HTMLChapterSectionInfo[];
};

export const PublicationsChapterSectionsList: React.FC<
	ChapterSectionsListProps
> = ({ sections }) => {
	return sections.length > 1 ? (
		<nav aria-labelledby="inpagenav-title" className={styles.inPageNav}>
			<h2 id="inpagenav-title">On this page</h2>
			<ul
				aria-label="Jump to sections on this page"
				className={styles.inPageNav__list}
			>
				{sections.map((section) => {
					const path = `#${section.chapterSlug}`;
					return (
						<li key={section.title}>
							<a href={path}>{section.title}</a>
						</li>
					);
				})}
			</ul>
		</nav>
	) : null;
};
