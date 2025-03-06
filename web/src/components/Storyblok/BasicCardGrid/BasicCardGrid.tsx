import Link from "next/link";

import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import { type CardGridStoryblok } from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

interface BasicCardGridBlokProps {
	blok: CardGridStoryblok;
}

export const BasicCardGrid = ({ blok }: BasicCardGridBlokProps): React.ReactElement => {
	const { cards } = blok;

	return (
		<Grid gutter="loose">
			{cards.map(({ heading, body, link, _uid }) => {
				let cardLink: CardHeadingLinkProps | undefined = undefined;
				const resolvedLink = link ? resolveStoryblokLink(link) : undefined;
				if (resolvedLink?.url) {
					cardLink = {
						destination: resolvedLink.url,
						elementType: resolvedLink.isInternal ? Link : "a",
						method: "href",
					};
				}

				return (
					<GridItem cols={12} md={{ cols: 4 }} key={_uid}>
						<Card headingText={heading} link={cardLink || undefined}>
							{body}
						</Card>
					</GridItem>
				);
			})}
		</Grid>
	);
};
