import { StoryblokComponentType } from "@storyblok/react";
import { ISbLinkURLObject } from "storyblok-js-client";

import { Card } from "@nice-digital/nds-card";
import { Grid, GridItem, type Columns } from "@nice-digital/nds-grid";

// TODO: check with SB about link type; there should be an internal type
type CardBlokProps = StoryblokComponentType<"card"> & {
	body: string;
	heading: string;
	link: {
		linktype: string;
		url: string;
		story?: ISbLinkURLObject;
	};
};

interface CardGridBlokProps {
	blok: {
		cards: CardBlokProps[];
		columns: number;
	};
}

export const CardGrid = ({ blok }: CardGridBlokProps): React.ReactElement => {
	console.log("Card grid blok:", blok);
	const { columns, cards } = blok;
	const gridCols = Math.floor(12 / columns) as Columns;

	return (
		<Grid>
			{cards.map(({ heading, body, link, _uid }) => {
				console.log("Link:", { link });
				return (
					<GridItem cols={gridCols} key={_uid}>
						<Card
							headingText={heading}
							link={link ? { destination: link.url } : undefined}
						>
							{body}
						</Card>
					</GridItem>
				);
			})}
		</Grid>
	);
};
