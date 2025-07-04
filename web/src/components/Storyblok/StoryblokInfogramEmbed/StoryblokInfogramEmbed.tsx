import Script from "next/script";
import { useEffect, useState } from "react";

import { InfogramEmbedStoryblok } from "@/types/storyblok";

import styles from "./StoryblokInfogramEmbed.module.scss";

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

const InfogramScript = "https://e.infogram.com/js/dist/embed-loader-min.js";

const extractChartIdFromUrl = (url: string): string | null => {
	try {
		const match = url.match(/infogram\.com\/([^/?#]+)/);
		return match ? match[1] : null;
	} catch (e) {
		console.error("Failed to extract Infogram chart ID from URL:", url);
		return null;
	}
};

export const StoryblokInfogramEmbed: React.FC<InfogramEmbedProps> = ({ blok }) => {
	const { infogramUrl, layoutVariant = "constrained", displayMode } = blok;
	const [scriptLoaded, setScriptLoaded] = useState(false);

	const infogramId = extractChartIdFromUrl(infogramUrl);

	const isBrowser = typeof window !== "undefined";

	// Check if the Infogram script is already loaded in the DOM
	const scriptTagAlreadyExists =
		isBrowser && !!document.getElementById("infogram-async");

	useEffect(() => {
		// If script is loaded and Infogram's load method exists, reload embeds (for HMR or dynamic changes)
		if (scriptLoaded && isBrowser && window.infogramEmbeds?.load) {
			window.infogramEmbeds.load();
		}
		// If script tag is present but scriptLoaded state is false, update the state to avoid reloading script___safety check
		if (scriptTagAlreadyExists && !scriptLoaded) {
			setScriptLoaded(true);
		}
	}, [scriptLoaded, infogramId, isBrowser, scriptTagAlreadyExists]);

	if (!infogramUrl || !infogramId) {
		return <div>Invalid or missing Infogram URL</div>;
	}

	const embedClass =
		layoutVariant === "constrained"
			? `infogram-embed ${styles.infogramEmbed} ${styles["infogramEmbed--constrained"]}`
			: `infogram-embed ${styles.infogramEmbed}`;

	return (
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
};
