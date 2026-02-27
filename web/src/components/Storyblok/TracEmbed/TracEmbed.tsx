import React, { useEffect, useRef, useState } from "react";

// import { TracEmbedblok } from "@/types/storyblok";

// TODO: hook up actual types from SB
export interface TracEmbedStoryblok {
	jobBoardsID: string;
	integrityKey?: string;
}
export interface TracEmbedProps {
	blok: TracEmbedStoryblok;
}

const TRAC_SCRIPT = "https://feeds.trac.jobs/js/v18/EmbeddedJobsBoard.js";

export const TracEmbed: React.FC<TracEmbedProps> = ({ blok }) => {
	const tracRef = useRef<HTMLDivElement | null>(null);

	const { jobBoardsID, integrityKey } = blok;
	console.log("TracEmbed content:", blok);
	/**NOTE:
	 * useEffect vs Script > nextJS will move the Script lower in DOM by default, which can cause embed injection to be placed below footer.
	 * By creating a script inline within the specific container, injected embed content remains contained where it should be
	 *
	 * Checking the trac embed script, it targets the currentId of the script and replaces it with the embedded Trac Job board app.  Next.js inserts the Script component in the head or at the end of the body, so the board renders below the footer.
	 * Using useEffect, creating and inserting the script inside the div container, maintains the trac embed position on page.
	 * */
	useEffect(() => {
		const container = tracRef.current;
		if (!container) return; //check if ref is attached to a DOM element
		if (document.getElementById("hj-feed-wrapper")) return; //check if script has already loaded and if so dont add it again
		if (container.querySelector<HTMLScriptElement>("#TracFeed")) return; //avoid adding multiple script tags if component re-renders

		const script = document.createElement("script");
		script.id = "TracFeed";
		script.async = true;
		script.src = `${TRAC_SCRIPT}`;
		script.setAttribute("id", "TracFeed");
		script.setAttribute("data-JobsBoardID", `${jobBoardsID}`);
		script.setAttribute("data-crossorigin", "anonymous");
		script.setAttribute(
			"data-integrity",
			"sha384-cbOYURIX2N9r4jpVDJ6a/26KtiH5SEH/OVD8xCrZpv/g54sYppB5Ci39vXvOXhNX"
		);
		script.setAttribute("data-IncludeCSS", "false");
		tracRef.current?.appendChild(script);
	}, [jobBoardsID]);
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
