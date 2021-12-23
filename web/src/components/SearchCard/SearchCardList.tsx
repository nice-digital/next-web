import React, { FC } from "react";
import * as xml2js from "xml2js";

import PathwaysIcon from "@nice-digital/icons/lib/Pathways";
import { Card } from "@nice-digital/nds-card";
import { Document } from "@nice-digital/search-client";

import { SearchSections } from "@/components/SearchSections/SearchSections";
import {
	searchFormatMeta,
	FormattedMetaItem,
} from "@/helpers/search-format-meta";

import styles from "./SearchCardList.module.scss";

export interface SearchCardListProps {
	documents: Document[];
}

type SubSections = { link: SubSection[] };

type MetaProps = {
	metadata?: FormattedMetaItem[];
};

export type SubSection = { $: { url: string }; _: string };

export const SearchCardList: FC<SearchCardListProps> = ({ documents }) => {
	const parser = new xml2js.Parser();

	return (
		<ol className={styles.list}>
			{documents.map((item: Document) => {
				const {
					id,
					title,
					guidanceRef,
					pathAndQuery,
					teaser,
					subSectionLinks,
				} = item;

				let parsedLinks;
				subSectionLinks &&
					parser.parseString(
						subSectionLinks,
						function (err: string, result: { SubSections: SubSections }) {
							if (err) {
								console.error("An error occurred - ", err);
							}
							parsedLinks = result.SubSections.link;
						}
					);

				const metaProps: MetaProps = {};

				if (searchFormatMeta(item).length > 0) {
					metaProps.metadata = searchFormatMeta(item);
				} else {
					delete metaProps.metadata;
				}

				return (
					<li className={styles.listItem} key={id}>
						<Card
							className={styles.card}
							elementType="div"
							headingText={
								<>
									{item.niceResultType == "NICE Pathway" ? (
										<PathwaysIcon className={styles.pathwaysIcon} />
									) : null}
									<span dangerouslySetInnerHTML={{ __html: title }} />
								</>
							}
							headinglink={pathAndQuery}
							summary={<span dangerouslySetInnerHTML={{ __html: teaser }} />}
							link={{
								destination: pathAndQuery,
							}}
							{...metaProps}
						/>
						{parsedLinks && (
							<SearchSections
								parsedLinks={parsedLinks}
								guidanceRef={guidanceRef}
							/>
						)}
					</li>
				);
			})}
		</ol>
	);
};
