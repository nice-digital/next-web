import classnames from "classnames";
import React, { FC } from "react";

import PathwaysIcon from "@nice-digital/icons/lib/Pathways";
import { Card, CardMetaDataProps } from "@nice-digital/nds-card";

import { KeyLink } from "@/components/KeyLink/KeyLink";
import { Sections } from "@/components/Sections/Sections";

import searchStyles from "./../../pages/search.page.module.scss";
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SearchCardProps {
	formattedTitle: JSX.Element;
	guidanceRef: string | null;
	headingLink: string;
	isPathway: boolean;
	metadata?: CardMetaDataProps[];
	parsedLinks?: [];
	summary: React.ReactNode;
}

export const SearchCard: FC<SearchCardProps> = ({
	formattedTitle,
	guidanceRef,
	headingLink,
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
				headingLink={headingLink}
				summary={summary}
				link={{
					destination: headingLink,
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
