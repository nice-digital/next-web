import React, { type FC } from "react";

import { Panel } from "@nice-digital/nds-panel";

import { Link } from "../Link/Link";

export type ProjectConsultationDocumentsLinkProps = {
	consultationUrls: string[];
};

export const ProjectConsultationDocumentsLink: FC<
	ProjectConsultationDocumentsLinkProps
> = ({ consultationUrls }) => {
	const hasMultipleConsultations =
		consultationUrls && consultationUrls?.length > 1;

	return (
		<Panel>
			<h3 className="h5">
				{hasMultipleConsultations ? "Consultations" : "Consultation"} in
				progress
			</h3>
			{consultationUrls.map((url, index) => (
				<>
					<Link to={url}>
						{`Consultation ${
							hasMultipleConsultations ? index + 1 : ""
						} documents`}
					</Link>
					{index < consultationUrls.length - 1 && <hr className="mv--d" />}
				</>
			))}
		</Panel>
	);
};
