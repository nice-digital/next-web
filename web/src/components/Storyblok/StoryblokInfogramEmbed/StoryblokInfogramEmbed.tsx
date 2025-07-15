import Script from "next/script";
import { useEffect, useState } from "react";

import { Grid, GridItem, type Columns } from "@nice-digital/nds-grid";

import { InfogramEmbedStoryblok, RichtextStoryblok } from "@/types/storyblok";

import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./StoryblokInfogramEmbed.module.scss";

declare global {
	interface Window {
		infogramEmbed?: {
			load: () => void;
		};
	}
}

export interface InfogramEmbedProps {
	blok: InfogramEmbedStoryblok;
}

const InfogramScript = "https://e.infogram.com/js/dist/embed-loader-min.js";

const extractChartIdFromUrl = (url: string): string | null =>
	url?.match(/infogram\.com\/([^/?#]+)/)?.[1] ?? null;

const getContent = (blokContent?: RichtextStoryblok) => {
	return blokContent?.type
		? blokContent
		: {
				type: "doc",
				content: [
					{
						type: "paragraph",
						content: [{ type: "text", text: "Default Content Value" }],
					},
				],
		  };
};

export const StoryblokInfogramEmbed: React.FC<InfogramEmbedProps> = ({
	blok,
}) => {
	const {
		infogramUrl,
		layoutVariant = "constrained",
		displayMode,
		_uid,
		infogramSize = "medium",
		infogramPosition = "right",
		hideInfogramOnSmallScreens = "false",
		content: rawContent,
	} = blok;

	const content = getContent(rawContent);
	const infogramId = extractChartIdFromUrl(infogramUrl);
	const isBrowser = typeof window !== "undefined";
	const [scriptLoaded, setScriptLoaded] = useState(false);

	const scriptTagAlreadyExists =
		isBrowser && !!document.getElementById("infogram-async");

	useEffect(() => {
		if (scriptLoaded && window.infogramEmbed?.load) {
			window.infogramEmbed.load();
		}
		if (scriptTagAlreadyExists && !scriptLoaded) {
			setScriptLoaded(true);
		}
	}, [scriptLoaded, infogramId, scriptTagAlreadyExists]);

	if (!infogramUrl || !infogramId) {
		return <div>Invalid or missing Infogram URL</div>;
	}

	const embedClass = [
		"infogram-embed",
		styles.infogramEmbed,
		displayMode === "standalone"
			? layoutVariant === "constrained" && styles["infogramEmbed--constrained"]
			: "",
	]
		.filter(Boolean)
		.join(" ");

	const sizeMap: Record<"medium" | "large", { embed: Columns; text: Columns }> =
		{
			medium: { embed: 4, text: 8 },
			large: { embed: 5, text: 7 },
		};
	const validSizes = ["medium", "large"] as const;
	const infogramSizeKey = validSizes.includes(infogramSize)
		? infogramSize
		: "medium";
	const { embed: embedCols, text: textCols } = sizeMap[infogramSizeKey];

	const contentStartsWithHeading =
		Array.isArray(content?.content) &&
		content.content.some(
			(block: { type?: string }) => block.type === "heading"
		);

	const infogramFirst = infogramPosition !== "right";
	const infogramVisible = hideInfogramOnSmallScreens !== "false";

	const infogramGridItemClass = [
		infogramVisible && styles["infogramEmbed--richText__infogramGrid"],
		contentStartsWithHeading
			? styles["infogramEmbed--richText__infogramWithHeadingstyles"]
			: styles["infogramEmbed--richText__infogramWithoutHeading"],
	]
		.filter(Boolean)
		.join(" ");

	const InfogramEmbedBlock = (
		<>
			{!scriptTagAlreadyExists && (
				<Script
					id="infogram-async"
					src={InfogramScript}
					strategy="afterInteractive"
					onLoad={() => setScriptLoaded(true)}
				/>
			)}
			<div
				className={embedClass}
				data-testid={infogramId}
				data-id={infogramId}
				data-title={infogramId}
				data-type="interactive"
				data-mode-type={displayMode}
			/>
		</>
	);

	// Render standalone embed
	if (displayMode === "standalone") {
		return InfogramEmbedBlock;
	}

	// Render embed with RichText content
	return (
		<Grid
			key={_uid}
			data-testid="infogram-richtext"
			className={styles["infogramEmbed--richText"]}
		>
			{infogramFirst ? (
				<>
					<GridItem
						data-testid="infogram-richtext-grid-item"
						cols={12}
						md={embedCols}
						className={infogramGridItemClass}
					>
						{InfogramEmbedBlock}
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
						{InfogramEmbedBlock}
					</GridItem>
				</>
			)}
		</Grid>
	);
};
