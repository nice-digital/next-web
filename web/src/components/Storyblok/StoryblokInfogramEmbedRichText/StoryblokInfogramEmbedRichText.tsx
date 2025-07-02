import React from "react";
import { Grid, GridItem, type Columns } from "@nice-digital/nds-grid";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";
import { ClientInfogramEmbed } from "../InfogramEmbed/ClientInfogramEmbed";
import styles from "./StoryblokInfogramEmbedRichText.module.scss";
import { InfogramRichTextStoryblok } from "@/types/storyblok";

interface InfogramEmbedRichTextProps {
	blok: InfogramRichTextStoryblok;
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
		hideInfogramOnSmallScreens = "false",
		_uid,
	} = blok;

	const sizeMap: Record<"medium" | "large", { embed: Columns; text: Columns }> =
		{
			medium: { embed: 4 as Columns, text: 8 as Columns },
			large: { embed: 5 as Columns, text: 7 as Columns },
		};
	const validInfogramSize = infogramSize === "" ? "medium" : infogramSize;
	const { embed: embedCols, text: textCols } = sizeMap[validInfogramSize];
	// Detect if any block in content is a heading
	const contentStartsWithHeading =
		Array.isArray(content?.content) &&
		content.content.some((block) => block.type === "heading");
	const infogramFirst = infogramPosition !== "right";
	const infogramVisibilityOnSmallScreens =
		hideInfogramOnSmallScreens === "false" ? false : true;
	const infogramGridItemClass = [
		infogramVisibilityOnSmallScreens
			? styles.infogramRichText__infogramGrid
			: null,
		contentStartsWithHeading
			? styles.infogramRichText__infogramWithHeading
			: styles.infogramRichText__infogramWithoutHeading,
	]
		.filter(Boolean)
		.join(" ");
	const infogramBlok = infogram && infogram[0];
	return (
		<Grid
			key={_uid}
			data-testid="infogram-richtext"
			className={styles.infogramRichText}
		>
			{infogramFirst ? (
				<>
					<GridItem
						data-testid="infogram-richtext-grid-item"
						cols={12}
						md={embedCols}
						className={infogramGridItemClass}
					>
						<ClientInfogramEmbed blok={infogramBlok} />
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
						<ClientInfogramEmbed blok={infogramBlok} />
					</GridItem>
				</>
			)}
		</Grid>
	);
};
