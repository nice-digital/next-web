import { Metadata } from "next";

import { publicRuntimeConfig } from "@/config";

/**
 * Gets the default SEO config for the given page.
 *
 * @param pathname The path of the current page
 * @returns The Next SEO config object
 */
export const getDefaultSeoConfig = (pathname: string): Metadata => ({
	metadataBase: new URL(publicRuntimeConfig.baseURL),
	title: {
		default: "NICE",
		template: "%s | NICE",
	},
	applicationName: "NICE",
	themeColor: {
		color: "#004650",
	},
	robots: "index, follow",
	openGraph: {
		type: "website",
		locale: "en_GB",
		url: publicRuntimeConfig.baseURL + pathname,
		siteName:
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
		creator: "@NICEComms",
		site: "@NICEComms",
		card: "summary",
	},
	alternates: {
		canonical: publicRuntimeConfig.baseURL + pathname,
	},
	icons: [
		{
			rel: "icon",
			url: publicRuntimeConfig.publicBaseURL + "/favicon.ico",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "16x16",
			url: publicRuntimeConfig.publicBaseURL + "/icons/icon-16x16.png",
		},
		{
			rel: "icon",
			type: "image/png",
			sizes: "32x32",
			url: publicRuntimeConfig.publicBaseURL + "/icons/icon-32x32.png",
		},
		// Apple icons
		{
			// iPhone (X/Plus)
			rel: "apple-touch-icon",
			sizes: "120x120",
			url: publicRuntimeConfig.publicBaseURL + "/icons/icon-120x120.png",
		},
		{
			// iPad, iPad mini
			rel: "apple-touch-icon",
			sizes: "152x152",
			url: publicRuntimeConfig.publicBaseURL + "/icons/icon-152x152.png",
		},
		{
			// iPad Pro
			rel: "apple-touch-icon",
			sizes: "167x167",
			url: publicRuntimeConfig.publicBaseURL + "/icons/icon-167x167.png",
		},
		{
			// iPhone
			rel: "apple-touch-icon",
			sizes: "180x180",
			url: publicRuntimeConfig.publicBaseURL + "/icons/icon-180x180.png",
		},
		// Safari pinned tab as per https://edibleco.de/3dRyFge
		{
			rel: "mask-icon",
			color: "black",
			url: publicRuntimeConfig.publicBaseURL + "/icons/safari-pinned-tab.svg",
		},
	],
	appleWebApp: {
		capable: true,
		title: "NICE",
	},
	viewport: {
		width: "device-width",
		initialScale: 1,
	},
	other: {
		"DC:Publisher": "NICE",
		"DC.Rights.Copyright":
			"All content on this site is NICE copyright unless otherwise stated. You can download material for private research, study or in-house use only. Do not distribute or publish any material from this site without first obtaining NICE's permission. Where Crown copyright applies, see the Office of Public Sector Information (formerly HMSO) website for information.",
		"DC.Language": "eng",
		"x-country": "gb",
		"msapplication-TileColor": "#004650",
		"x-ua-compatible": "IE=edge; chrome=1",
	},
});
