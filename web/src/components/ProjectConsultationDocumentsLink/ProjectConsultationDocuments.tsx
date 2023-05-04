import classnames from "classnames";
import React, { type FC } from "react";

import { Button } from "@nice-digital/nds-button";

import { Link } from "../Link/Link";

import styles from "./ProjectConsultationDocuments.module.scss";

export type ProjectConsultationDocumentsLinkProps = {
	consultationUrls: string[];
};

export const ProjectConsultationDocumentsLink: FC<
	ProjectConsultationDocumentsLinkProps
> = ({ consultationUrls }) => {
	if (consultationUrls.length == 0) return null;

	const hasMultipleConsultations =
		consultationUrls && consultationUrls?.length > 1;

	return hasMultipleConsultations ? (
		<ul
			className={classnames([
				"list list--unstyled",
				styles.consultationDocumentsLinkContainer,
			])}
		>
			{consultationUrls.map((url, index) => (
				<li key={`Read consultation ${index + 1} documents`}>
					<Button
						variant="cta"
						to={url}
						className={styles.consultationDocumentsLinkButton}
						elementType={Link}
					>
						Read consultation {index + 1} documents
					</Button>
				</li>
			))}
		</ul>
	) : (
		<div className={styles.consultationDocumentsLinkContainer}>
			<Button
				key={`Read consultation documents`}
				variant="cta"
				to={consultationUrls[0]}
				className={styles.consultationDocumentsLinkButton}
				elementType={Link}
			>
				Read the consultation documents
			</Button>
		</div>
	);
};
