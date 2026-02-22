"use client";
import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";

// import { TracEmbedblok } from "@/types/storyblok";
// import styles from "./TracEmbed.module.scss";

// TODO: hook up actual types from SB
export interface TestTracEmbedStoryblok {
	content: string;
}
export interface TracEmbedProps {
	blok: TestTracEmbedStoryblok;
}

const TRAC_SCRIPT = "https://feeds.trac.jobs/js/v18/EmbeddedJobsBoard.js";

const board_id = 101965,
	aria_label = "test title",
	integrity_hash =
		"sha384-cbOYURIX2N9r4jpVDJ6a/26KtiH5SEH/OVD8xCrZpv/g54sYppB5Ci39vXvOXhNX";

export const TracEmbed: React.FC<TracEmbedProps> = ({ blok }) => {
	const tracRef = useRef<HTMLDivElement | null>(null);

	const { content } = blok;

	/**NOTE:
	 * useEffect vs Script > nextJS will move the Script lower in DOM by default, which can cause embed injection to be placed below footer.
	 * By creating a script inline within the specific container, injected embed content remains contained where it should be
	 *
	 * Checking the trac embed script, it targets the currentId of the script and replaces it with the embedded Trac Job board app.  Next.js inserts the Script component in the head or at the end of the body, so the board renders below the footer.
	 * Using useEffect, creating and inserting the script inside the div container, maintains the trac embed position on page.
	 * */
	useEffect(() => {
		if (!tracRef.current || document.getElementById("hj-feed-wrapper")) return;

		const script = document.createElement("script");
		script.id = "TracFeed";
		script.async = true;
		script.src = `${TRAC_SCRIPT}`;
		script.setAttribute("id", "TracFeed");
		script.setAttribute("data-JobsBoardID", `${board_id}`);
		script.setAttribute("data-crossorigin", "anonymous");
		script.setAttribute("data-integrity", `${integrity_hash}`);
		script.setAttribute("data-IncludeCSS", "true");
		tracRef.current?.appendChild(script);
	}, []);

	return (
		<div>
			<div
				ref={tracRef}
				aria-live="polite"
				id="trac-jobs-container"
				aria-label={aria_label}
			></div>
		</div>
	);
};
