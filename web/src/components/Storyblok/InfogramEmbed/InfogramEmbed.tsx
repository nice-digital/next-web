import Script from "next/script";
import { useEffect, useState } from "react";

import { InfogramEmbedStoryblok } from "@/types/storyblok";

import styles from "./infogramEmbed.module.scss";

declare global {
	interface Window {
		infogramEmbeds?: {
			load: () => void;
		};
	}
}

export interface InfogramEmbedProps {
	blok: InfogramEmbedStoryblok;
}

const INFOGRAMSCRIPT = "https://e.infogram.com/js/dist/embed-loader-min.js";

/**
 * Extracts Infogram chart ID from the given URL.
 * Infogram URLs look like: https://infogram.com/chartID
 * Returns chartID string or null if not found.
 */
const extractChartIdFromUrl = (url: string): string | null => {
	try {
		const match = url.match(/infogram\.com\/([^/?#]+)/);
		return match ? match[1] : null;
	} catch (e) {
		console.error("Failed to extract Infogram chart ID from URL:", url);
		return null;
	}
};

const InfogramEmbed: React.FC<InfogramEmbedProps> = ({ blok }) => {
	const {
		infogramUrl,
		infogramVariant = "interactive", // Default to interactive if variant not set
		layoutVariant = "default", // Default layout variant
	} = blok;

	const [scriptLoaded, setScriptLoaded] = useState(false);

	// Extract chart ID from the URL (e.g. "ta-cancer-decisions-by-type-1hxj48nzk5x54vg")
	const infogramId = extractChartIdFromUrl(infogramUrl);

	// Check if code is running in browser (to access document/window)
	const isBrowser = typeof window !== "undefined";

	// Check if the Infogram script is already loaded in the DOM
	const scriptAlreadyExists =
		isBrowser && !!document.getElementById("infogram-async");

	console.log("infogramUrl", blok);

	useEffect(() => {
		// If script is loaded and Infogram's load method exists, reload embeds (for HMR or dynamic changes)
		if (scriptLoaded && isBrowser && window.infogramEmbeds?.load) {
			window.infogramEmbeds.load();
		}
		// If script tag is present but scriptLoaded state is false, update the state to avoid reloading script___safety check
		if (scriptAlreadyExists && !scriptLoaded) {
			setScriptLoaded(true);
		}
	}, [scriptLoaded, infogramId, isBrowser, scriptAlreadyExists]);

	// Render fallback if URL is missing or ID extraction failed
	if (!infogramUrl || !infogramId) {
		return <div>Invalid or missing Infogram URL</div>;
	}

	// Determine CSS classes based on layout variant
	const embedClass =
		layoutVariant === "default"
			? `infogram-embed ${styles.infogramEmbed} ${styles.infogramEmbed__default}`
			: `infogram-embed ${styles.infogramEmbed}`;

	return (
		<>
			{/* Load Infogram embed script only if not already loaded */}
			{!scriptAlreadyExists && (
				<Script
					id="infogram-async"
					src={INFOGRAMSCRIPT}
					strategy="afterInteractive"
					onLoad={() => setScriptLoaded(true)}
				/>
			)}
			{/* The div where Infogram will inject the chart */}
			<div
				className={embedClass}
				data-testid={infogramId}
				data-id={infogramId}
				data-title={infogramId} // Using chart ID as title fallback
				data-type={infogramVariant} // Embed variant type (interactive, static, etc.)
			/>
		</>
	);
};

export default InfogramEmbed;
