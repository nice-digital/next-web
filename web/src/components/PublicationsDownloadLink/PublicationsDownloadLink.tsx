import React, { FC } from "react";

import { Button } from "@nice-digital/nds-button";

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
		<Button
			aria-label={ariaLabel}
			variant="cta"
			className={styles.download}
			href={downloadLink}
		>
			Download indicator (PDF)
		</Button>
	);
};
