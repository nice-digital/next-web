import { FC } from "react";

import { Link } from "@/components/Link/Link";

export interface KeyLinkProps {
	keyLink?: { text: string; url: string };
	guidanceRef?: string | null;
}

export const KeyLink: FC<KeyLinkProps> = ({ keyLink, guidanceRef }) => {
	return keyLink ? (
		<Link to={keyLink.url} className="mr--d pv--c" style={{ float: "left" }}>
			<a>
				{keyLink.text}
				<span className="visually-hidden">{` for ${guidanceRef}`}</span>
			</a>
		</Link>
	) : null;
};
