import Script from "next/script";
import { FC } from "react";

/**
 * Ensures the `dataLayer` variable exists, loads the GTM snippet and creates the noscript GTM iframe
 */
export const GoogleTagManager: FC = () => (
	<>
		<noscript>
			<iframe
				src="https://www.googletagmanager.com/ns.html?id=GTM-M55QTQ"
				height="0"
				width="0"
				style={{ display: "none" }}
			></iframe>
		</noscript>
		<Script strategy="lazyOnload">
			{/* Ensure the dataLayer array exists - lazy loading gtm.js means our code could execute before GTM has loaded */}
			{`window.dataLayer = window.dataLayer || [];`}
		</Script>
		<Script
			src="https://www.googletagmanager.com/gtm.js?id=GTM-M55QTQ"
			strategy="afterInteractive"
			onLoad={() => {
				window.dataLayer.push({
					"gtm.start": new Date().getTime(),
					event: "gtm.js",
				});
			}}
		/>
	</>
);
