import Link from "next/link";

import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";

import { CardListStoryblok } from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

export interface CardListProps {
	blok: CardListStoryblok;
}

export const CardList: React.FC<CardListProps> = ({ blok }: CardListProps) => {
	const { cards } = blok;

	return (
		<ul className="list list--unstyled">
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
					<Card
						elementType="li"
						headingText={heading}
						link={cardLink || undefined}
						key={_uid}
					>
						{body}
					</Card>
				);
			})}
		</ul>
	);
};
