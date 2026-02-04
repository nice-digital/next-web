import classnames from "classnames";
import React, { type PropsWithChildren, type FC } from "react";

import { Button } from "@nice-digital/nds-button";

import styles from "./publicationsDownloadLink.module.scss";

export type PublicationsDownloadLinkProps = PropsWithChildren<{
	ariaLabel?: string;
	downloadLink: string | null;
	className: string | null;
}>;

export const PublicationsDownloadLink: FC<PublicationsDownloadLinkProps> = ({
	ariaLabel,
	downloadLink,
	children,
	className = "",
}) => {
	return downloadLink ? (
		<Button
			aria-label={ariaLabel}
			variant="cta"
			className={classnames([styles.download, className])}
			to={downloadLink}
			target="_blank"
		>
			{children || "Download"} (PDF)
		</Button>
	) : null;
};
