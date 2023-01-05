import React, { type PropsWithChildren, type FC } from "react";

import { Button } from "@nice-digital/nds-button";

export type ProjectConsultationDocumentsLinkProps = PropsWithChildren<{
	ariaLabel?: string;
	consultationLink: string | null;
}>;

{
	/*
			individual documents :-
			Diagnostics consultation document (Online commenting) - https://www.nice.org.uk/consultations/1567/1/dap63-dcd-automated-abpi-for-consultation-webdocx
			Diagnostics consultation document (PDF) - https://www.nice.org.uk/guidance/GID-DG10049/documents/514
			Committee papers – Diagnostics assessment report, Overview, DAR Comments table and EAG response, DAR Addendum, DAR Erratum -https://www.nice.org.uk/guidance/GID-DG10049/documents/diagnostics-assessment-report
			  foreach (var consultation in Model.ConsultationUrls)
        {
            consultationIndex++;
            <div>
                @if (Model.ConsultationUrls.Count > 1)
                {
                    <a class="btn btn-primary" href="@consultation">Read consultation @consultationIndex documents</a>
                    if (consultationIndex < Model.ConsultationUrls.Count)
                    {
                        <br /><br />
                    }
                }
                else
                {
                    <a class="btn btn-primary" href="@consultation">Read the consultation documents</a>
                }
            </div>
        } */
}

{
	// TODO Read the consultation documents link example - https://alpha.nice.org.uk/guidance/indevelopment/gid-ipg10308/consultation/html-content
	// TODO direct link to online commenting document vs overview page url
	/* TODO what happens with multiple consultation urls? */
}

export const ProjectConsultationDocumentsLink: FC<
	ProjectConsultationDocumentsLinkProps
> = ({ ariaLabel, consultationLink, children }) => {
	return consultationLink ? (
		<Button
			aria-label={ariaLabel}
			variant="cta"
			to={`/indicators/indevelopment${consultationLink}`}
			target="_blank"
		>
			{children}
		</Button>
	) : null;
};
