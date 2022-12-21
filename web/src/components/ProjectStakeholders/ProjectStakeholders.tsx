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
							<li key={`legacyStakeholder_${index}`}>
								{legacyStakeholder.item}
							</li>
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
