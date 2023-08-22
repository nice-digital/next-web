import { Card } from "@nice-digital/nds-card";
import { Grid, GridItem, type Columns } from "@nice-digital/nds-grid";

import { type CardGridStoryblok } from "@/types/storyblok";

interface CardGridBlokProps {
	blok: CardGridStoryblok;
}

export const CardGrid = ({ blok }: CardGridBlokProps): React.ReactElement => {
	console.log("Card grid blok:", blok);
	const { columns, cards } = blok;

	const gridCols = Math.floor(12 / parseInt(columns)) as Columns;

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
