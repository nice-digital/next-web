import React from "react";
import { Grid, GridItem, type Columns } from "@nice-digital/nds-grid";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";
import {ClientInfogramEmbed }from "../InfogramEmbed/ClientInfogramEmbed";
import styles from "./InfogramEmbedRichText.module.scss";
import { InfogramRichTextStoryblok } from "@/types/storyblok";

// Update the props interface
interface InfogramEmbedRichTextProps {
	blok: InfogramRichTextStoryblok
	className?: string;
}

export const InfogramEmbedRichText: React.FC<InfogramEmbedRichTextProps> = ({
	blok,
}) => {
	const {
		infogram,
		content,
		infogramSize = "medium",
		infogramPosition = "right",
		hideImagesOnSmallScreens = "false",
		_uid,
	} = blok;
console.log("InfogramEmbedRichText", blok);
	const sizeMap: Record<"medium" | "large", { embed: Columns; text: Columns }> =
		{
			medium: { embed: 4 as Columns, text: 8 as Columns },
			large: { embed: 5 as Columns, text: 7 as Columns },
		};
	const validInfogramSize = infogramSize === "" ? "medium" : infogramSize;
	const { embed: embedCols, text: textCols } = sizeMap[validInfogramSize];

	const infogramFirst = infogramPosition !== "right";
		const imageVisibilityOnSmallScreens =
		hideImagesOnSmallScreens === "false" ? false : true;
		const infogramGridItemClass = [
		imageVisibilityOnSmallScreens
			? styles.infogramRichText__infogramGrid
			: null,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Grid
			key={_uid}
			data-testid="infogram-richtext"
			// className={styles.imageRichText}
		>
			{infogramFirst ? (
				<>
					<GridItem
						data-testid="infogram-richtext-grid-item"
						cols={12}
						md={embedCols}
						className={infogramGridItemClass}
					>
						{/* Replace this with your actual Infogram embed code */}
						{/* <InfogramEmbed blok={embedBlok} /> */}
						<ClientInfogramEmbed blok={infogram[0]} />
					</GridItem>
					<GridItem
						cols={12}
						md={textCols}
						data-testid="infogram-richtext-grid-item"
					>
						<StoryblokRichText content={content} />
					</GridItem>
				</>
			) : (
				<>
					<GridItem
						cols={12}
						md={textCols}
						data-testid="infogram-richtext-grid-item"
					>
						<StoryblokRichText content={content} />
					</GridItem>
					<GridItem
						data-testid="infogram-richtext-grid-item"
						cols={12}
						md={embedCols}
						className={infogramGridItemClass}
					>
						<ClientInfogramEmbed blok={infogram[0]}  />
					</GridItem>
				</>
			)}
		</Grid>
	);
};
