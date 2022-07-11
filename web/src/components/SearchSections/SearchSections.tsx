import { FC, useMemo } from "react";

import ChevronRight from "@nice-digital/icons/lib/ChevronDown";
import { Panel } from "@nice-digital/nds-panel";
import { Document } from "@nice-digital/search-client";

import { Link } from "@/components/Link/Link";

import styles from "./SearchSections.module.scss";

const qualityStatementsChapterLinkRegex =
	/\/chapter\/(?:list-of-quality-statements$|list-of-statements$|quality-statements$)/im;

const recommendationsChapterLinkRegex =
	/\/chapter\/(?:recommendations|\d+-recommendations|\d+-guidance)$/im;

const keyLinkFinder =
	(keyLinkRegex: RegExp) => (el: Document["subSections"][0]) =>
		keyLinkRegex.test(el.url);

export interface SearchSectionsProps {
	subSections: Document["subSections"];
	guidanceRef?: string | null;
}

export const SearchSections: FC<SearchSectionsProps> = ({
	subSections,
	guidanceRef,
}) => {
	const keyLink = useMemo(() => {
		const recLink = subSections.find(
			keyLinkFinder(recommendationsChapterLinkRegex)
		);

		if (recLink) return { text: "View recommendations", url: recLink.url };

		const qsLink = subSections.find(
			keyLinkFinder(qualityStatementsChapterLinkRegex)
		);

		if (qsLink) return { text: "View quality statements", url: qsLink.url };
		return null;
	}, [subSections]);

	return (
		<div className={styles.wrapper}>
			{keyLink && (
				<Link to={keyLink.url} className={styles.keyLink}>
					<a>
						{keyLink.text}
						<span className="visually-hidden">{` for ${guidanceRef}`}</span>
					</a>
				</Link>
			)}
			<details className={styles.details}>
				<summary className="btn btn--inverse">
					Show all sections
					<ChevronRight />
				</summary>
				<Panel className={styles.panel}>
					{guidanceRef && <h4>Sections for {guidanceRef}</h4>}
					<ul className="list list--unstyled">
						{subSections.map((subSection, index) => (
							<li key={index}>
								<a href={subSection.url}>{subSection.title}</a>
							</li>
						))}
					</ul>
				</Panel>
			</details>
		</div>
	);
};
