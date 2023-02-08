import classnames from "classnames";
import React, { type FC } from "react";

import { Button } from "@nice-digital/nds-button";

import { IndevConsultation } from "@/feeds/inDev/types";

import styles from "./ProjectConsultationDocuments.module.scss";

export type ProjectConsultationDocumentsLinkProps = {
	consultationPanels: IndevConsultation[];
};

export const ProjectConsultationDocumentsLink: FC<
	ProjectConsultationDocumentsLinkProps
> = ({ consultationPanels }) => {
	if (consultationPanels.length == 0) return null;

	const hasMultipleConsultations =
		consultationPanels && consultationPanels?.length > 1;

	return hasMultipleConsultations ? (
		<ul
			className={classnames([
				"list list--unstyled",
				styles.consultationDocumentsLinkContainer,
			])}
		>
			{consultationPanels.map((consultation, index) => (
				<li key={`Read consultation ${index + 1} documents`}>
					<Button
						variant="cta"
						target="_blank"
						to={`/indicators/indevelopment${consultation.links.self[0].href}`}
						className={styles.consultationDocumentsLinkButton}
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
				target="_blank"
				to={`/indicators/indevelopment${consultationPanels[0].links.self[0].href}`}
				className={styles.consultationDocumentsLinkButton}
			>
				Read the consultation documents
			</Button>
		</div>
	);
};
