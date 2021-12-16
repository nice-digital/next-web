import classnames from "classnames";
import React, { FC } from "react";

import PathwaysIcon from "@nice-digital/icons/lib/Pathways";
import { Card, CardMetaDataProps } from "@nice-digital/nds-card";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import { KeyLink } from "@/components/KeyLink/KeyLink";
import { Sections } from "@/components/Sections/Sections";

import { SubSections } from "src/pages/search.page";

import searchStyles from "./../../pages/search.page.module.scss";

export interface SearchCardProps {
	formattedTitle: JSX.Element;
	guidanceRef: string | null;
	headinglink: string;
	keyLink?: { text: string; url: string };
	isPathway: boolean;
	metadata: CardMetaDataProps[];
	parsedLinks?: [];
	summary: React.ReactNode;
}

export const SearchCard: FC<SearchCardProps> = ({
	formattedTitle,
	guidanceRef,
	headinglink,
	keyLink,
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
				<Grid gutter="loose">
					{keyLink && (
						<GridItem
							className="mb--d"
							cols={12}
							md={3}
							// lg={12}
							elementType="div"
							//TODO aria-label=""
						>
							<KeyLink keyLink={keyLink} />
						</GridItem>
					)}
					<GridItem
						cols={12}
						md={9}
						// lg={12}
						elementType="div"
						//TODO aria-label=""
					>
						<Sections parsedLinks={parsedLinks} guidanceRef={guidanceRef} />
					</GridItem>
				</Grid>
			)}
		</>
	);
};
