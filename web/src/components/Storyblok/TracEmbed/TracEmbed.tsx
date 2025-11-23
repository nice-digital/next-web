"use client";
import Script from "next/script";
import React from "react";

// import { TraxEmbedblok } from "@/types/storyblok";

// import styles from "./TracEmbed.module.scss";

// interface BlockquoteBlokProps {
// 	blok: QuoteStoryblok;
// }

{
	/* <script>
(function() {
var script = document.createElement("script");
script.src = "https://feeds.trac.jobs/js/v18/EmbeddedJobsBoard.js";
script.setAttribute("id", "TracFeed");
script.setAttribute("data-JobsBoardID", "101965");
script.setAttribute("data-crossorigin", "anonymous");
script.setAttribute("data-integrity", "asha384-cbOYURIX2N9r4jpVDJ6a/26KtiH5SEH/OVD8xCrZpv/g54sYppB5Ci39vXvOXhNX");
script.setAttribute("data-IncludeCSS", "false");
document.write(script.outerHTML);
})();</script> */
}

export const TracEmbed = ({}): React.ReactElement => {
	const tracScript = "https://feeds.trac.jobs/js/v18/EmbeddedJobsBoard.js";
	return (
		<div aria-live="polite">
			<div aria-live="polite" id="trac-jobs-container" />

			{/* <Script
				defer
				id="TracFeed"
				src={tracScript}
				data-JobsBoardID="101965"
				data-crossorigin="anonymous"
				data-integrity="asha384-cbOYURIX2N9r4jpVDJ6a/26KtiH5SEH/OVD8xCrZpv/g54sYppB5Ci39vXvOXhNX"
				data-IncludeCSS="false"
				// strategy="afterInteractive"
			/> */}

			<Script
				id="trac_feed"
				strategy="afterInteractive"
				onLoad={() => console.log("embed loaded")}
			>
				{`(function() {
					 if (document.getElementById("TracFeed")) return;
						var s = document.createElement("script");
						s.id = "TracFeed";
						s.async = true;
						s.src = "https://feeds.trac.jobs/js/v18/EmbeddedJobsBoard.js";
						s.setAttribute("id", "TracFeed");
						s.setAttribute("data-JobsBoardID", "101965");
						s.setAttribute("data-crossorigin", "anonymous");
						s.setAttribute("data-integrity", "asha384-cbOYURIX2N9r4jpVDJ6a/26KtiH5SEH/OVD8xCrZpv/g54sYppB5Ci39vXvOXhNX");
						s.setAttribute("data-IncludeCSS", "false");
						document.getElementById("trac-jobs-container").appendChild(s);
					})();`}
			</Script>
		</div>
	);
};
