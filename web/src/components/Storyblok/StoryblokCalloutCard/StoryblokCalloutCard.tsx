import React from "react";
import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";
import Link from "next/link";
import { StoryblokImage } from "../StoryblokImage/StoryblokImage";
import { CalloutCardStoryblok, CalloutCardWithImageStoryblok } from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

export interface StoryblokCalloutCardProps {
	blok: CalloutCardStoryblok | CalloutCardWithImageStoryblok;
}

export const StoryblokCalloutCard: React.FC<StoryblokCalloutCardProps > = ({
	blok,
}: StoryblokCalloutCardProps) => {
	const { heading, body, link, image } = blok;
	console.log("blok", blok);
	let cardLink: CardHeadingLinkProps | undefined = undefined;
	const resolvedLink = link ? resolveStoryblokLink(link) : undefined;
	console.log("resolved link", resolvedLink);
	if (resolvedLink?.url) {
		cardLink = {
			destination: resolvedLink.url,
			elementType: resolvedLink.isInternal ? Link : "a",
			method: "href",
		};
	}
	console.log("link",link);
	
	const renderImage = () => {
		return image ? (
			<StoryblokImage
				src={image?.filename ? image.filename : undefined}
				alt={image?.alt || "callout card image"}
				serviceOptions={{ height: 0, quality: 80, width: 708 }}
			/>
		) : null;
	};

	return (
		<div>
			<Card
				headingText={heading}
				callout
				link={cardLink || undefined}
				image={renderImage()}
			>
				{body}
			</Card>
		</div>
	);
};
