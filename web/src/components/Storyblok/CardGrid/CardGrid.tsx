import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";
import { Grid, GridItem, type Columns } from "@nice-digital/nds-grid";

import { type CardGridStoryblok } from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

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
				let cardLink: CardHeadingLinkProps | undefined = undefined;
				const resolvedLink = link ? resolveStoryblokLink(link) : undefined;
				if (resolvedLink) {
					cardLink = {
						destination: resolvedLink,
					};
				}

				return (
					<GridItem cols={gridCols} key={_uid}>
						<Card headingText={heading} link={cardLink || undefined}>
							{body}
						</Card>
					</GridItem>
				);
			})}
		</Grid>
	);
};
