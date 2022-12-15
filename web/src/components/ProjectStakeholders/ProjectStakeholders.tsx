import { FC } from "react";

import { IndevCommentator, IndevConsultee } from "@/feeds/inDev/types";

export type StakeholdersProps = {
	consultees?: IndevConsultee[];
	commentators?: IndevCommentator[];
};

export const Stakeholders: FC<StakeholdersProps> = ({
	consultees,
	commentators,
}) => {
	const hasStakeholderContent =
		(consultees && consultees.length > 0) ||
		(commentators && commentators.length > 0)
			? true
			: false;
	return hasStakeholderContent ? (
		<>
			<h3>Stakeholders</h3>
			{consultees && consultees?.length > 0 ? (
				<>
					<dl>
						{consultees?.map((consultee) => {
							return (
								<>
									<dt>{consultee.column1}</dt>
									<dd>{consultee.column2}</dd>
								</>
							);
						})}
					</dl>
				</>
			) : null}
			{commentators && commentators.length > 0 ? (
				<dl>
					{commentators?.map((commentator) => {
						return (
							<>
								<dt>{commentator.column1}</dt>
								<dd>{commentator.column2}</dd>
							</>
						);
					})}
				</dl>
			) : null}
		</>
	) : null;
};
