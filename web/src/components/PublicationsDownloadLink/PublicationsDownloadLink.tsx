import React, { FC } from "react";

import { Button } from "@nice-digital/nds-button";

import { Link } from "@/components/Link/Link";

export type PublicationsDownloadLinkProps = {
	ariaLabel: string;
	downloadLink: string;
};

export const PublicationsDownloadLink: FC<PublicationsDownloadLinkProps> = ({
	ariaLabel,
	downloadLink,
}) => {
	return (
		<Button aria-label={ariaLabel} variant="cta">
			<Link href={downloadLink}>
				<a>Download indicator (PDF)</a>
			</Link>
		</Button>
	);
};
