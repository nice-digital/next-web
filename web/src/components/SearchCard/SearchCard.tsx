import classnames from "classnames";
import React, { FC } from "react";

import PathwaysIcon from "@nice-digital/icons/lib/Pathways";
import { Card, CardMetaDataProps } from "@nice-digital/nds-card";

import { KeyLink } from "@/components/KeyLink/KeyLink";
import { Sections } from "@/components/Sections/Sections";

import searchStyles from "./../../pages/search.page.module.scss";

export interface SearchCardProps {
	formattedTitle: JSX.Element;
	guidanceRef: string | null;
	headinglink: string;
	isPathway: boolean;
	metadata: CardMetaDataProps[];
	parsedLinks?: [];
	summary: React.ReactNode;
}

export const SearchCard: FC<SearchCardProps> = ({
	formattedTitle,
	guidanceRef,
	headinglink,
	isPathway,
	metadata,
	parsedLinks,
	summary,
}) => {
	return (
		<>
			<Card
				className={classnames(["mb--d", searchStyles.card])}
				elementType="div"
				headingText={
					<>
						{isPathway && <PathwaysIcon className="mr--b" />}
						{formattedTitle}
					</>
				}
				headinglink={headinglink}
				summary={summary}
				link={{
					destination: headinglink,
				}}
				metadata={metadata}
			/>
			{parsedLinks && (
				<>
					<KeyLink parsedLinks={parsedLinks} />
					<Sections parsedLinks={parsedLinks} guidanceRef={guidanceRef} />
				</>
			)}
		</>
	);
};
