import React, { useEffect, useRef } from "react";

import { publicRuntimeConfig } from "@/config";
import { logger } from "@/logger";
import { TracEmbedStoryblok } from "@/types/storyblok";

export interface TracEmbedProps {
	blok: TracEmbedStoryblok;
}

export const StoryblokTracEmbed: React.FC<TracEmbedProps> = ({ blok }) => {
	const version = publicRuntimeConfig.trac.version;
	const integrityKey = publicRuntimeConfig.trac.integrityKey;
	const tracScript = `https://feeds.trac.jobs/js/${version}/EmbeddedJobsBoard.js`;

	const tracRef = useRef<HTMLDivElement | null>(null);

	const { jobBoardID } = blok;

	const isInvalidConfig = !version || !integrityKey || !jobBoardID;

	/**NOTE:
	 * useEffect vs Script > nextJS will move the Script lower in DOM by default, which can cause embed injection to be placed below footer.
	 * By creating a script inline within the specific container, injected embed content remains contained where it should be
	 *
	 * Checking the trac embed script, it targets the currentId of the script and replaces it with the embedded Trac Job board app.  Next.js inserts the Script component in the head or at the end of the body, so the board renders below the footer.
	 * Using useEffect, creating and inserting the script inside the div container, maintains the trac embed position on page.
	 * */

	useEffect(() => {
		if (isInvalidConfig) return;

		const container = tracRef.current;
		if (!container) return;
		if (document.getElementById("hj-feed-wrapper")) return;
		if (container.querySelector<HTMLScriptElement>("#TracFeed")) return;

		const script = document.createElement("script");
		script.id = "TracFeed";
		script.async = true;
		script.src = `${tracScript}`;
		script.crossOrigin = "anonymous";
		script.integrity = integrityKey || "";
		script.setAttribute("id", "TracFeed");
		script.setAttribute("data-JobsBoardID", `${jobBoardID}`);
		script.setAttribute("data-IncludeCSS", "false");
		script.setAttribute("data-testid", "trac-feed-script");
		tracRef.current?.appendChild(script);
	}, [jobBoardID, integrityKey, tracScript, isInvalidConfig]);

	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash;

			window.dataLayer?.push({
				event: "tracjobs-hashchange",
				hash: hash,
				url: window.location.href,
			});
		};

		window.addEventListener("hashchange", handleHashChange);

		return () => {
			window.removeEventListener("hashchange", handleHashChange);
		};
	}, []);

	if (isInvalidConfig) {
		logger.warn(
			{
				version,
				integrityKey: Boolean(integrityKey),
				jobBoardID: Boolean(jobBoardID),
			},
			"TRAC embed configuration invalid or missing"
		);
		return <div>We are unable to load job listings at the moment.</div>;
	}

	return (
		<div>
			<div
				ref={tracRef}
				aria-live="polite"
				id="trac-jobs-container"
				aria-label="Trac Jobs Board"
			></div>
		</div>
	);
};
