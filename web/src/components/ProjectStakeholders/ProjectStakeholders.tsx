import { FC } from "react";

import {
	IndevCommentator,
	IndevConsultee,
	IndevLegacyStakeholder,
} from "@/feeds/inDev/types";

export type StakeholdersProps = {
	consultees?: IndevConsultee[];
	commentators?: IndevCommentator[];
	legacyStakeholders?: IndevLegacyStakeholder[];
};

export const Stakeholders: FC<StakeholdersProps> = ({
	consultees,
	commentators,
	legacyStakeholders,
}) => {
	const hasStakeholderContent =
		(legacyStakeholders && legacyStakeholders.length > 0) ||
		(consultees && consultees.length > 0) ||
		(commentators && commentators.length > 0)
			? true
			: false;
	return hasStakeholderContent ? (
		<>
			<h3>Stakeholders</h3>
			{legacyStakeholders && legacyStakeholders.length > 0 ? (
				<ul aria-label="Legacy stakeholders">
					{legacyStakeholders.map((legacyStakeholder, index) => {
						return (
							<li
								key={`legacyStakeholder_${index}`}
								dangerouslySetInnerHTML={{ __html: legacyStakeholder.item }}
							/>
						);
					})}
				</ul>
			) : null}
			{consultees && consultees?.length > 0 ? (
				<>
					<dl aria-label="Consultee stakeholders">
						{consultees.map((consultee, index) => {
							return (
								<>
									<dt key={`consulteedt_${index}`}>{consultee.column1}</dt>
									<dd key={`consulteedd_${index}`}>{consultee.column2}</dd>
								</>
							);
						})}
					</dl>
				</>
			) : null}
			{commentators && commentators.length > 0 ? (
				<dl aria-label="Commentator stakeholders">
					{commentators.map((commentator, index) => {
						return (
							<>
								<dt key={`commentatordt_${index}`}>{commentator.column1}</dt>
								<dd key={`commentatordd_${index}`}>{commentator.column2}</dd>
							</>
						);
					})}
				</dl>
			) : null}
		</>
	) : null;
};

{
	/* TODO Legacy stakeholders */
}
{
	/* @if (Model.LegacyStakeholders.Any())
                        {
                            <h3>Stakeholders</h3>
                            <ul class="unstyled">
                                @foreach (var item in Model.LegacyStakeholders)
                {
                                    <li>@Html.Raw(item.Item)</li>
                                }
                            </ul>
                            if (Model.StakeHolderRegistrationLinkViewModel != null && !string.IsNullOrEmpty(Model.StakeHolderRegistrationLinkViewModel.Link))
                            {
                                <p><a href="@Model.StakeHolderRegistrationLinkViewModel.Link">Stakeholder Registration Form</a></p>
                            }
                        } */
}
