import { FC, useMemo } from "react";

import ChevronRight from "@nice-digital/icons/lib/ChevronDown";
import { Panel } from "@nice-digital/nds-panel";

import { Link } from "@/components/Link/Link";

import { SubSections } from "src/pages/search.page";

import styles from "./SearchSections.module.scss";

const qualityStatementsChapterLinkRegex =
	/\/chapter\/(?:list-of-quality-statements$|list-of-statements$|quality-statements$)/im;

const recommendationsChapterLinkRegex =
	/\/chapter\/(?:recommendations|\d+-recommendations|\d+-guidance)$/im;

const keyLinkFinder = (keyLinkRegex: RegExp) => (el: SubSections) =>
	keyLinkRegex.test(el.$.url);

export interface SearchSectionsProps {
	parsedLinks: SubSections[];
	guidanceRef?: string | null;
}

export const SearchSections: FC<SearchSectionsProps> = ({
	parsedLinks,
	guidanceRef,
}) => {
	const keyLink = useMemo(() => {
		const recLink = parsedLinks.find(
			keyLinkFinder(recommendationsChapterLinkRegex)
		);

		if (recLink) return { text: "View recommendations", url: recLink.$.url };

		const qsLink = parsedLinks.find(
			keyLinkFinder(qualityStatementsChapterLinkRegex)
		);

		if (qsLink) return { text: "View quality statements", url: qsLink.$.url };
		return null;
	}, [parsedLinks]);

	return (
		<div className="mb--d">
			{keyLink && (
				<Link
					to={keyLink.url}
					className="mr--d pv--c"
					style={{ float: "left" }}
				>
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
				<Panel>
					{guidanceRef && <h4>Sections for {guidanceRef}</h4>}
					<ul className="list list--unstyled">
						{(parsedLinks as SubSections[]).map(({ $, _ }, index) => (
							<li key={index}>
								<a href={$.url}>{_}</a>
							</li>
						))}
					</ul>
				</Panel>
			</details>
		</div>
	);
};
