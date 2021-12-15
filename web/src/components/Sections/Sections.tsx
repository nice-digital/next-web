import classnames from "classnames";
import { FC } from "react";

import ChevronRight from "@nice-digital/icons/lib/ChevronDown";
import { Panel } from "@nice-digital/nds-panel";

import { SubSections } from "src/pages/search.page";

import searchStyles from "./../../pages/search.page.module.scss";

export interface SectionsProps {
	parsedLinks: SubSections[];
	guidanceRef?: string | null;
}

export const Sections: FC<SectionsProps> = ({
	parsedLinks,
	guidanceRef,
}: {
	parsedLinks: SubSections[];
	guidanceRef: string;
}) => {
	return (
		<details className={searchStyles.details}>
			<summary
				className={classnames([
					"btn",
					"btn--inverse",
					searchStyles.summaryControl,
				])}
			>
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
	);
};
