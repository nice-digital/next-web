import React, { type PropsWithChildren, type FC } from "react";

import { Button } from "@nice-digital/nds-button";

import styles from "./publicationsDownloadLink.module.scss";

export type PublicationsDownloadLinkProps = PropsWithChildren<{
	ariaLabel?: string;
	downloadLink: string | null;
}>;

export const PublicationsDownloadLink: FC<PublicationsDownloadLinkProps> = ({
	ariaLabel,
	downloadLink,
	children,
}) => {
	return downloadLink ? (
		<Button
			aria-label={ariaLabel}
			variant="cta"
			className={styles.download}
			to={downloadLink}
			target="_blank"
		>
			{children || "Download"} (PDF)
		</Button>
	) : null;
};
