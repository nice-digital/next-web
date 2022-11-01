import React, { FC } from "react";

import { Button } from "@nice-digital/nds-button";

import { Link } from "@/components/Link/Link";

import styles from "./PublicationsDownloadLink.module.scss";

export type PublicationsDownloadLinkProps = {
	ariaLabel: string;
	downloadLink: string;
};

export const PublicationsDownloadLink: FC<PublicationsDownloadLinkProps> = ({
	ariaLabel,
	downloadLink,
}) => {
	return (
		<Button aria-label={ariaLabel} variant="cta" className={styles.download}>
			<Link href={downloadLink}>
				<a>Download indicator (PDF)</a>
			</Link>
		</Button>
	);
};
