import React, { type FC } from "react";

import { ProjectStatus, TopicSelectionReason } from "@/feeds/inDev/types";
import { ProductTypeAcronym } from "@/feeds/publications/types";
import { formatDateStr, stripTime } from "@/utils/datetime";

import { DefinitionList } from "../DefinitionList/DefinitionList";
import { Link } from "../Link/Link";
import { ProjectConsultationDocumentsLink } from "../ProjectConsultationDocumentsLink/ProjectConsultationDocuments";

export type ProjectInformationProps = {
	consultationUrls: string[];
	description: string | null;
	idNumber: string | null;
	process: string | null;
	projectType: string | null;
	reference: string;
	referralDate: string | null;
	status: string;
	summary: string | null;
	suspendDiscontinuedReason: string | null;
	suspendDiscontinuedUrl: string | null;
	suspendDiscontinuedUrlText: string | null;
	technologyType: string | null;
	title: string;
	topicSelectionReason: string | null;
	topicSelectionFurtherInfo: string | null;

	children?: never;
};

export const ProjectInformation: FC<ProjectInformationProps> = ({
	consultationUrls,
	description,
	idNumber,
	process,
	projectType,
	referralDate,
	status,
	summary,
	suspendDiscontinuedReason,
	suspendDiscontinuedUrl,
	suspendDiscontinuedUrlText,
	technologyType,
	topicSelectionReason,
	topicSelectionFurtherInfo,
}) => {
	let topicSelectionReasonText;

	switch (topicSelectionReason) {
		case "Monitor":
			topicSelectionReasonText = TopicSelectionReason.Monitor;
			break;
		case "Anticipate":
			topicSelectionReasonText = TopicSelectionReason.Anticipate;
			break;
		case "NotEligible":
			topicSelectionReasonText = TopicSelectionReason.NotEligible;
			break;
		case "FurtherDiscussion":
			topicSelectionReasonText = TopicSelectionReason.FurtherDiscussion;
			break;
		default:
			topicSelectionReasonText = null;
			break;
	}

	return (
		<>
			{projectType?.toLowerCase().startsWith("ipg") ? (
				<p>
					<Link to="/about/what-we-do/our-Programmes/NICE-guidance/NICE-interventional-procedures-guidance/IP-register-an-interest">
						Register an interest in this interventional procedure
					</Link>
				</p>
			) : null}
			{summary && (
				<div
					dangerouslySetInnerHTML={{
						__html: `<p>${summary}</p>`,
					}}
				></div>
			)}
			{suspendDiscontinuedReason && (
				<p data-testid="suspendDiscontinuedReason">
					{suspendDiscontinuedReason}
				</p>
			)}
			{suspendDiscontinuedUrl && suspendDiscontinuedUrlText && (
				<Link to={suspendDiscontinuedUrl}>
					<>{suspendDiscontinuedUrlText}</>
				</Link>
			)}
			<ProjectConsultationDocumentsLink consultationUrls={consultationUrls} />
			<DefinitionList ariaLabel="Project information">
				{status && (
					<>
						<dt>Status:</dt> <dd>{status}</dd>
					</>
				)}
				{technologyType && (
					<>
						<dt>Technology type:</dt> <dd>{technologyType}</dd>
					</>
				)}
				{topicSelectionReasonText && (
					<>
						<dt>Reason for decision:</dt> <dd>{topicSelectionReasonText}</dd>
					</>
				)}
				{topicSelectionFurtherInfo && (
					<>
						<dt>Further information:</dt> <dd>{topicSelectionFurtherInfo}</dd>
					</>
				)}
				{process && status !== ProjectStatus.TopicSelection ? (
					projectType == ProductTypeAcronym.NG ? (
						<>
							<dt>Developed as:</dt> <dd>{process}</dd>
						</>
					) : (
						<>
							<dt>Process:</dt> <dd>{process}</dd>
						</>
					)
				) : null}
				{description && (
					<>
						<dt>Description:</dt>
						<dd dangerouslySetInnerHTML={{ __html: description }} />
					</>
				)}
				{idNumber && (
					<>
						<dt>ID number:</dt> <dd>{idNumber}</dd>
					</>
				)}

				{process == "MT" && referralDate ? (
					<>
						<dt>Notification date:</dt> <dd>{referralDate}</dd>
					</>
				) : (
					referralDate && (
						<>
							<dt>Referral date:</dt>
							<dd>
								<time dateTime={stripTime(referralDate)}>
									&nbsp;{formatDateStr(referralDate)}
								</time>
							</dd>
						</>
					)
				)}
			</DefinitionList>
		</>
	);
};
