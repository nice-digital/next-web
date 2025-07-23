import Link from "next/link";
import React from "react";

import { Card, type CardHeadingLinkProps } from "@nice-digital/nds-card";

import { StoryblokImage } from "@/components/Storyblok/StoryblokImage/StoryblokImage";
import {
	CalloutCardStoryblok,
	CalloutCardWithImageStoryblok,
} from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

import styles from "./StoryblokCalloutCard.module.scss";

export interface StoryblokCalloutCardProps {
	blok: CalloutCardStoryblok | CalloutCardWithImageStoryblok;
}

export const StoryblokCalloutCard: React.FC<StoryblokCalloutCardProps> = ({
	blok,
}: StoryblokCalloutCardProps) => {
	const { heading, body, link, image } = blok;
	let cardLink: CardHeadingLinkProps | undefined = undefined;
	const resolvedLink = resolveStoryblokLink(link);
	if (resolvedLink?.url) {
		cardLink = {
			destination: resolvedLink.url,
			elementType: resolvedLink.isInternal ? Link : "a",
			method: "href",
		};
	}
	const renderImage = () => {
		return image ? (
			<StoryblokImage
				src={image.filename}
				alt={image?.alt || "callout card image"}
				serviceOptions={{ quality: 80 }}
				className={styles.calloutImageContainer}
			/>
		) : null;
	};

	return (
		<Card
			headingText={heading}
			callout
			link={cardLink}
			image={renderImage()}
			data-tracking="card--callout"
			data-component="card--callout"
			summary={body}
		/>
	);
};
