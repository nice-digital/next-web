import classnames from "classnames";
import Link from "next/link";

import { StoryblokRichText } from "@/components/Storyblok/StoryblokRichText/StoryblokRichText";
import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";

import { CardListSectionStoryblok } from "@/types/storyblok";
import { fieldHasValidContent, resolveStoryblokLink } from "@/utils/storyblok";

import { toTitleCase } from "@/utils/string";
import styles from "./CardListSection.module.scss";

export interface CardListSectionProps {
	blok: CardListSectionStoryblok;
}

export const CardListSection: React.FC<CardListSectionProps> = ({
	blok
}: CardListSectionProps) => {
	const {
		heading,
		headingLevel,
		leadText,
		verticalPadding = "medium",
		theme,
		cards,
	} = blok;

	const HeadingElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;
	const transparentClass = theme === "subtle" ? undefined : styles.transparent;
	const verticalPaddingClass = `cardSection${toTitleCase(
		verticalPadding
	)}Spacing`;
	const richTextHasContent = fieldHasValidContent(leadText) && leadText;

	console.log("leadText>>>", leadText);

	return (
		<section
			className={classnames(
				styles.cardSection,
				styles[verticalPaddingClass],
				transparentClass
			)}
		>
			<div className={styles.container}>
				{heading || richTextHasContent ? (
					<div className={styles.cardSectionListIntro}>
						{heading && (
							<HeadingElement className={styles.heading}>
								{heading}
							</HeadingElement>
						)}
						{richTextHasContent && (
							<StoryblokRichText
								content={leadText}
								className={styles.leadText}
							/>
						)}
					</div>
				) : undefined}

				<ul className="list list--unstyled">
					{cards.map(({ heading, body, link, _uid }) => {
						let cardLink: CardHeadingLinkProps | undefined = undefined;
						const resolvedLink = link.url
							? resolveStoryblokLink(link)
							: undefined;
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
			</div>
		</section>
	);
};
