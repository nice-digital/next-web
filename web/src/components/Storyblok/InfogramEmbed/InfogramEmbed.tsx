import Script from "next/script";
import { InfogramEmbedStoryblok } from "@/types/storyblok";
import { useEffect, useState } from "react";

import styles from "./InfogramEmbed.module.css";

declare global {
	interface Window {
		infogramEmbeds?: {
			load: () => void;
			[key: string]: any;
		};
	}
}

export interface InfogramEmbedProps {
	blok: InfogramEmbedStoryblok;
}
//should we set as env vars or should we try to get it from the embed code?
const INFOGRAMSCRIPT = "https://e.infogram.com/js/dist/embed-loader-min.js";

// moved extract logic to own function, unit test it

const extractEmbedData = (embedCode: string) => {
	//Added regext on storyblok to make sure that the content editors put the embed code in the correct format
	// Use regex to extract the data-id, data-title, and data-type from the embed code
	try {
		const dataIdMatch = embedCode.match(/data-id="([^"]+)"/);
		const dataId = dataIdMatch ? dataIdMatch[1] : null;

		const dataTitleMatch = embedCode.match(/data-title="([^"]+)"/);
		const dataTitle = dataTitleMatch ? dataTitleMatch[1] : null;

		const dataTypeMatch = embedCode.match(/data-type="([^"]+)"/);
		const dataType = dataTypeMatch ? dataTypeMatch[1] : "interactive"; // default to 'interactive' if dataType not found
		// const scrptSrcMatch = embedCode.match(/([^"]+).js/);
		// const scrptSrc = scrptSrcMatch ? scrptSrcMatch[1] : null;//tried to get the script src from the embed code, but it doesn't always work, so we are using the INFOGRAMSCRIPT constant instead

		return {
			dataId,
			dataTitle,
			dataType,
			isValid: !!(dataId && dataTitle && dataType), // Check if all values are present};
		};
	} catch (error) {
		console.error("Error extracting embed data:", error);
		return {
			dataId: null,
			dataTitle: null,
			dataType: null,
			isValid: false,
		};
	}
};

/** NOTE: finding HMR(hot module reloading) doesn't always load the embed */
export const InfogramEmbed: React.FC<InfogramEmbedProps> = ({ blok }) => {
	const { embedCode, variant } = blok;
	const embedData = embedCode ? extractEmbedData(embedCode) : null;
	const [scriptLoaded, setScriptLoaded] = useState(false);
	// Should we use a ref to check if the script is already loaded?
	// By using the Script component from next/script and the scriptLoaded state, we ensure the script loads only once after the component mounts.
	// should we use next/script instead of hooks?
	// TODO: Check if the script is already loaded
	//modified to use next/script and checking if the script is already loaded
	useEffect(() => {
		// Try to re-initialize Infogram if the function exists
		if (
			scriptLoaded &&
			typeof window !== "undefined" &&
			window.infogramEmbeds?.load
		) {
			window.infogramEmbeds.load(); //this will (re)load the infogram embeds when embedData changes
			console.log("window", window);
		}
	}, [scriptLoaded, embedData]);
	//check with John if we should use this approach or Dale's approach
	// Check if embedCode is a string and not empty
	if (!embedCode) {
		return <div>Embed code is not available</div>;
	}
	// Check if embedData is valid
	if (!embedData || !embedData.isValid) {
		return <div>Embed code is invalid</div>;
	}
	const embedClass =
		variant === "default"
			? `infogram-embed ${styles.infogramEmbed__default}`
			: "infogram-embed";
	return (
		<>
			<Script
				id="infogram-async"
				src={INFOGRAMSCRIPT}
				strategy="afterInteractive"
				onLoad={() => setScriptLoaded(true)}
			/>
			<div
				className={embedClass}
				data-id={embedData.dataId}
				data-title={embedData.dataTitle}
				data-type={embedData.dataType}
			/>
		</>
	);
};

// export default InfogramEmbed;
// // import Script from "next/script";
// import { useEffect } from "react";

// import { InfogramEmbedStoryblok } from "@/types/storyblok";

// export interface InfogramEmbedProps {
// 	blok: InfogramEmbedStoryblok;
// }

// //should we set as env vars or should we try to get it from the embed code?
// const INFOGRAMSCRIPT = "https://e.infogram.com/js/dist/embed-loader-min.js";
// const INFOGRAMSCRIPTID = "infogram-async";

// // moved extract logic to own function, unit test it
// const extractEmbedData = (embedCode: string) => {
// 	try {
// 		// Use regex to extract the data-id, data-title, and data-type from the embed code
// 		const dataIdMatch = embedCode.match(/data-id="([^"]+)"/);
// 		const dataId = dataIdMatch ? dataIdMatch[1] : null;

// 		const dataTitleMatch = embedCode.match(/data-title="([^"]+)"/);
// 		const dataTitle = dataTitleMatch ? dataTitleMatch[1] : null;

// 		const dataTypeMatch = embedCode.match(/data-type="([^"]+)"/);
// 		const dataType = dataTypeMatch ? dataTypeMatch[1] : "interactive"; // default to 'interactive' if dataType not found

// 		// const scrptSrcMatch = embedCode.match(/([^"]+).js/);
// 		// const scrptSrc = scrptSrcMatch ? scrptSrcMatch[1] : null;

// 		return {
// 			dataId,
// 			dataTitle,
// 			dataType,
// 			isValid: !!(dataId && dataTitle && dataType),
// 		};
// 		// Check if all values are present};
// 	} catch (error) {
// 		console.error("Error extracting embed data:", error);
// 		return {
// 			dataId: null,
// 			dataTitle: null,
// 			dataType: null,
// 			isValid: false,
// 		};
// 	}
// };

// /** NOTE: finding HMR(hot module reloading) doesn't always load the embed */
// export const InfogramEmbed: React.FC<InfogramEmbedProps> = ({ blok }) => {
// 	const embedCode = blok.embedCode;
// 	const embedData = embedCode ? extractEmbedData(embedCode) : null;

// 	// Should we use a ref to check if the script is already loaded?
// 	// should we use next/script instead of hooks?
// 	// TODO: Check if the script is already loaded
// 	useEffect(() => {
// 		// Check if the script is already loaded
// 		const existingScript = document.getElementById(INFOGRAMSCRIPTID);
// 		if (existingScript) {
// 			// If the script is already loaded, do nothing
// 			return;
// 		}

// 		// Check if embedCode is a string and not empty
// 		if (typeof embedCode === "string" && embedCode.trim() !== "") {
// 			const script = document.createElement("script");
// 			script.src = INFOGRAMSCRIPT;
// 			script.id = "infogram-async";
// 			script.async = true;
// 			document.body.appendChild(script);

// 			return () => {
// 				document.body.removeChild(script);
// 			};
// 		}
// 		// If embedCode is not a string or is empty, do nothing
// 		// return () => {};
// 	}, [embedCode]);

// 	// Check if embedCode is a string and not empty
// 	if (!embedCode) {
// 		return <div>Embed code is not available</div>;
// 	}

// 	// Check if embedData is valid
// 	if (!embedData || !embedData.isValid) {
// 		return <div>Embed code is invalid</div>;
// 	}

// 	return (
// 		<>
// 			<div
// 				className="infogram-embed"
// 				data-id={embedData.dataId}
// 				data-title={embedData.dataTitle}
// 				data-type={embedData.dataType}
// 			/>

// 			{/*
// 		we can hard code the values here but we should probably use the data from the embed code so we are using the same values (what happens if infogram change src url or id for script tag?).
// 		<Script
//             id="infogram-async"
//             src="https://e.infogram.com/js/dist/embed-loader-min.js"
//             strategy="afterInteractive"
//         /> */}
// 		</>
// 	);
// };

// export default InfogramEmbed;
