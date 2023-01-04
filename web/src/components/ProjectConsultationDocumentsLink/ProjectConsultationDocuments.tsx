import React, { type PropsWithChildren, type FC } from "react";

import { Button } from "@nice-digital/nds-button";

export type ProjectConsultationDocumentsLinkProps = PropsWithChildren<{
	ariaLabel?: string;
	downloadLink: string | null;
}>;

export const ProjectConsultationDocumentsLink: FC<
	ProjectConsultationDocumentsLinkProps
> = ({ ariaLabel, downloadLink, children }) => {
	return downloadLink ? (
		<Button
			aria-label={ariaLabel}
			variant="cta"
			to={downloadLink}
			target="_blank"
		>
			{children}
		</Button>
	) : null;
};
