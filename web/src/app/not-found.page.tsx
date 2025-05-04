import { Metadata } from "next";

import { getDefaultSeoConfig } from "./../pages/seo.config";
import NotFoundClient from "./not-found-client";

// Note: 500 (and other status codes) are handled via LINK ./_error.page.tsx

export const generateMetadata = async (): Promise<Metadata> => {
	//TODO: can canonical pathname be calculated?
	const defaultSeoConfig = getDefaultSeoConfig("") as Metadata;

	delete defaultSeoConfig.alternates; //remove canonical for not-found page.

	return {
		...defaultSeoConfig,
		title: "Page not found | NICE",
		description:
			"We can't find this page. It's probably been moved, updated or deleted.",
	};
};
export default function NotFoundPage(): JSX.Element {
	return <NotFoundClient />;
}
