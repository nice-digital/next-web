import classnames from "classnames";
import { FC, useMemo, useState } from "react";

import ChevronRight from "@nice-digital/icons/lib/ChevronDown";
import { Panel } from "@nice-digital/nds-panel";
import { Document } from "@nice-digital/search-client";

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
	const [isExpanded, setIsExpanded] = useState(false);

	const keyLink = useMemo(() => {
		const recLink =
			subSections &&
			subSections.find(keyLinkFinder(recommendationsChapterLinkRegex));

		if (recLink) return { text: "View recommendations", url: recLink.url };

		const qsLink =
			subSections &&
			subSections.find(keyLinkFinder(qualityStatementsChapterLinkRegex));

		if (qsLink) return { text: "View quality statements", url: qsLink.url };
		return null;
	}, [subSections]);

	return (
		<div className={styles.wrapper}>
			{keyLink && (
				<a href={keyLink.url} className={styles.keyLink}>
					{keyLink.text}
					<span className="visually-hidden">{` for ${guidanceRef}`}</span>
				</a>
			)}
			<details
				className={styles.details}
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<summary
					className={classnames(["btn btn--inverse", styles.detailSummary])}
					aria-expanded={isExpanded}
				>
					{isExpanded ? "Hide" : "Show"} all sections
					<ChevronRight />
				</summary>
				<Panel
					className={classnames([
						styles.panel,
						keyLink ? styles.withKeyLink : null,
					])}
				>
					{guidanceRef && <h4>Sections for {guidanceRef}</h4>}
					<ul className="list list--unstyled">
						{subSections &&
							subSections.map((subSection, index) => (
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
