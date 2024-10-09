import { NextSeoProps } from "next-seo";

import { publicRuntimeConfig } from "@/config";

/**
 * Gets the default SEO config for the given page.
 *
 * @param pathname The path of the current page
 * @returns The Next SEO config object
 */
export const getDefaultSeoConfig = (pathname: string): NextSeoProps => ({
	titleTemplate: `%s | NICE`,
	openGraph: {
		type: "website",
		locale: "en_GB",
		url: publicRuntimeConfig.baseURL + pathname,
		site_name:
			"NICE website: The National Institute for Health and Care Excellence",
		images: [
			// Landscape open graph image used on Twitter's 'summary_large_image' card type and Facebook (+ others)
			{
				url:
					publicRuntimeConfig.publicBaseURL +
					"/open-graph/open-graph-1200x630.png",
				width: 1200,
				height: 630,
				alt: "Logo for NICE (The National Institute for Health and Care Excellence)",
			},
			// Square open graph image: used for Twitter's 'summary' card type
			{
				url:
					publicRuntimeConfig.publicBaseURL +
					"/open-graph/open-graph-1200x1200.png",
				width: 1200,
				height: 1200,
				alt: "Logo for NICE (The National Institute for Health and Care Excellence)",
			},
		],
	},
	twitter: {
		handle: "@NICEComms",
		site: "@NICEComms",
		cardType: "summary",
	},
	additionalLinkTags: [
		// Old school favicon
		{
			rel: "icon",
			href: publicRuntimeConfig.publicBaseURL + "/favicon.ico",
		},
		// PNG 'favicons'
		{
			rel: "icon",
			type: "image/png",
			sizes: "16x16",
			href: publicRuntimeConfig.publicBaseURL + "/icons/icon-16x16.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "32x32",
			href: publicRuntimeConfig.publicBaseURL + "/icons/icon-32x32.png",
		},
		// Apple icons
		{
			// iPhone (X/Plus)
			rel: "apple-touch-icon",
			sizes: "120x120",
			href: publicRuntimeConfig.publicBaseURL + "/icons/icon-120x120.png",
		},
		{
			// iPad, iPad mini
			rel: "apple-touch-icon",
			sizes: "152x152",
			href: publicRuntimeConfig.publicBaseURL + "/icons/icon-152x152.png",
		},
		{
			// iPad Pro
			rel: "apple-touch-icon",
			sizes: "167x167",
			href: publicRuntimeConfig.publicBaseURL + "/icons/icon-167x167.png",
		},
		{
			// iPhone
			rel: "apple-touch-icon",
			sizes: "180x180",
			href: publicRuntimeConfig.publicBaseURL + "/icons/icon-180x180.png",
		},
		// Safari pinned tab as per https://edibleco.de/3dRyFge
		{
			rel: "mask-icon",
			color: "black",
			href: publicRuntimeConfig.publicBaseURL + "/icons/safari-pinned-tab.svg",
		},
		{
			rel: "canonical",
			href: publicRuntimeConfig.baseURL + pathname,
		},
	],
	additionalMetaTags: [
		{
			name: "viewport",
			content: "width=device-width, initial-scale=1, shrink-to-fit=no",
		},
		{
			name: "application-name",
			content: "NICE",
		},
		{
			name: "DC:Publisher",
			content: "NICE",
		},
		{
			name: "DC.Rights.Copyright",
			content:
				"All content on this site is NICE copyright unless otherwise stated. You can download material for private research, study or in-house use only. Do not distribute or publish any material from this site without first obtaining NICE's permission. Where Crown copyright applies, see the Office of Public Sector Information (formerly HMSO) website for information.",
		},
		{
			name: "DC.Language",
			content: "eng",
		},
		{
			name: "x-country",
			content: "gb",
		},
		// Apple specific as per https://edibleco.de/3jQIcIf
		{
			name: "apple-mobile-web-app-capable",
			content: "yes",
		},
		{
			name: "apple-mobile-web-app-title",
			content: "NICE",
		},
		// Theme colours
		{
			name: "theme-color",
			content: "#004650",
		},
		{
			name: "msapplication-TileColor",
			content: "#004650",
		},
		// IE11 rendering
		{
			httpEquiv: "x-ua-compatible",
			content: "IE=edge; chrome=1",
		},
	],
});
