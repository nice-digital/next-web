import { Metadata } from "next";
import NotFoundClient from "./not-found-client";
import { getDefaultSeoConfig } from "./../pages/next-seo.config";

// Note: 500 (and other status codes) are handled via LINK ./_error.page.tsx

  export const generateMetadata = async(): Promise<Metadata> => {
	//TODO: can canonical pathname be calculated?
	const defaultSeoConfig = getDefaultSeoConfig("not-found") as unknown as Metadata;
	return {
		title: {
			default: "Page not found | NICE",
			template: "%s | NICE",
	  	},
	  	description: "We can't find this page. It's probably been moved, updated or deleted.",
	  	...defaultSeoConfig}
  }
export default function NotFoundPage(): JSX.Element {
	return (
		<NotFoundClient />
	);
}
