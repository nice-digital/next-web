import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import {
	CardStoryblok,
	type GridSectionItemStoryblok,
} from "@/types/storyblok";

//TODO: handle correct type checking and conversion of columns from SB to Column type for type safety
interface GridSectionItemStoryblokExtended
	extends Omit<GridSectionItemStoryblok, "columns"> {
	columns: 12 | 6 | 4;
}

interface GridSectionItemBlokProps {
	blok: GridSectionItemStoryblokExtended;
}

export const StoryblokGridSectionItem = ({
	blok,
}: GridSectionItemBlokProps): React.ReactElement => {
	const { cards, columns } = blok;

	return (
		<Grid gutter="loose">
			{cards &&
				cards.map((card: CardStoryblok) => {
					let cardLink: CardHeadingLinkProps | undefined = undefined;
					const resolvedLink = card.link;
					if (resolvedLink?.url) {
						cardLink = {
							destination: resolvedLink.url,
							elementType: resolvedLink.isInternal ? "a" : "a",
							method: "href",
						};
					}

					return (
						<GridItem cols={12} md={{ cols: columns }} key={card._uid}>
							<Card headingText={card.heading} link={cardLink || undefined}>
								{card.body}
							</Card>
						</GridItem>
					);
				})}
		</Grid>
	);
	// return (
	// 	<Grid gutter="loose">
	// 		{/* {cards &&
	// 			cards.map((card: CardStoryblok) => {
	// 				// let cardLink: CardHeadingLinkProps | undefined = undefined;
	// 				// const resolvedLink = link ? resolveStoryblokLink(link) : undefined;
	// 				// if (resolvedLink?.url) {
	// 				// 	cardLink = {
	// 				// 		destination: resolvedLink.url,
	// 				// 		elementType: resolvedLink.isInternal ? Link : "a",
	// 				// 		method: "href",
	// 				// 	};
	// 				// }

	// 				return ( */}
	// 		<GridItem cols={12} md={{ cols: columns }} key={123132}>
	// 			blurb
	// 		</GridItem>
	// 		{/* );
	// 			})} */}
	// 	</Grid>
	// );
};
