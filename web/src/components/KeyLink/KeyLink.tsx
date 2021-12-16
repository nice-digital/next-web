import { FC } from "react";

import { Link } from "@/components/Link/Link";

import { SubSections } from "src/pages/search.page";

export interface KeyLinkProps {
	keyLink?: { text: string; url: string };
}

export const KeyLink: FC<KeyLinkProps> = ({ keyLink }) => {
	return keyLink ? (
		<Link to={keyLink.url}>
			<a>{keyLink.text}</a>
		</Link>
	) : null;
};
