import { FC } from "react";

import {
	IndevCommentator,
	IndevConsultee,
	IndevLegacyStakeholder,
} from "@/feeds/inDev/types";

import { DefinitionList } from "../DefinitionList/DefinitionList";

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
					<DefinitionList ariaLabel="Consultee stakeholders">
						{consultees.map((consultee, index) => {
							return (
								<div key={`consulteelist_${index}`}>
									<dt key={`consulteedt_${index}`}>{consultee.column1}</dt>
									<dd key={`consulteedd_${index}`}>{consultee.column2}</dd>
								</div>
							);
						})}
					</DefinitionList>
				</>
			) : null}
			{commentators && commentators.length > 0 ? (
				<DefinitionList ariaLabel="Commentator stakeholders">
					{commentators.map((commentator, index) => {
						return (
							<div key={`commentatorlist_${index}`}>
								<dt key={`commentatordt_${index}`}>{commentator.column1}</dt>
								<dd key={`commentatordd_${index}`}>{commentator.column2}</dd>
							</div>
						);
					})}
				</DefinitionList>
			) : null}
		</>
	) : null;
};
