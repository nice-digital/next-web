import React, { type FC } from "react";

import { ProjectStatus, TopicSelectionReason } from "@/feeds/inDev/types";
import { ProductTypeAcronym } from "@/feeds/publications/types";
import { formatDateStr, stripTime } from "@/utils/datetime";

import { DefinitionList } from "../DefinitionList/DefinitionList";
import { Link } from "../Link/Link";
import { ProjectConsultationDocumentsLink } from "../ProjectConsultationDocumentsLink/ProjectConsultationDocuments";

export type ProjectInformationProps = {
	project: {
		consultationLink: string | null;
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
		topicSelectionDecision: string | null;
		topicSelectionReason: string | null;
		topicSelectionFurtherInfo: string | null | undefined;
	};
	children?: never;
};

export const ProjectInformation: FC<ProjectInformationProps> = ({
	project,
}) => {
	const {
		consultationLink,
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
		topicSelectionDecision,
		topicSelectionReason,
		topicSelectionFurtherInfo,
	} = project;

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
				<Link to="/about/what-we-do/our-Programmes/NICE-guidance/NICE-interventional-procedures-guidance/IP-register-an-interest">
					Register an interest in this interventional procedure
				</Link>
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
			<ProjectConsultationDocumentsLink
				ariaLabel="Read the consultation documents"
				consultationLink={consultationLink}
			>
				Read the consultation documents
			</ProjectConsultationDocumentsLink>
			{status && (
				<DefinitionList ariaLabel="Status">
					<dt>Status:</dt> <dd>{status}</dd>
				</DefinitionList>
			)}
			{technologyType && (
				<DefinitionList ariaLabel="Technology type">
					<dt>Technology type:</dt> <dd>{technologyType}</dd>
				</DefinitionList>
			)}
			{topicSelectionDecision && (
				<DefinitionList ariaLabel="Decision">
					<dt>Decision:</dt> <dd>{topicSelectionDecision}</dd>
				</DefinitionList>
			)}
			{topicSelectionReasonText && (
				<DefinitionList ariaLabel="Reason for decision">
					<dt>Reason for decision:</dt> <dd>{topicSelectionReasonText}</dd>
				</DefinitionList>
			)}
			{topicSelectionFurtherInfo && (
				<DefinitionList ariaLabel="Further information">
					<dt>Further information:</dt> <dd>{topicSelectionFurtherInfo}</dd>
				</DefinitionList>
			)}
			{process && status !== ProjectStatus.TopicSelection ? (
				projectType == ProductTypeAcronym.NG ? (
					<DefinitionList ariaLabel="Developed as">
						<dt>Developed as:</dt> <dd>{process}</dd>
					</DefinitionList>
				) : (
					<DefinitionList ariaLabel="Process">
						<dt>Process:</dt> <dd>{process}</dd>
					</DefinitionList>
				)
			) : null}
			{description && (
				<DefinitionList ariaLabel="Description">
					<dt>Description:</dt>
					<dd dangerouslySetInnerHTML={{ __html: description }} />
				</DefinitionList>
			)}
			{idNumber && (
				<DefinitionList ariaLabel="ID number">
					<dt>ID number:</dt> <dd>{idNumber}</dd>
				</DefinitionList>
			)}
			{/* TODO check formatting of referral date */}
			{process == "MT" && referralDate ? (
				<DefinitionList ariaLabel="Notification date">
					<dt>Notification date:</dt> <dd>{referralDate}</dd>
				</DefinitionList>
			) : (
				referralDate && (
					<DefinitionList ariaLabel="Referral date">
						<dt>Referral date:</dt>
						<dd>
							<time dateTime={stripTime(referralDate)}>
								&nbsp;{formatDateStr(referralDate)}
							</time>
						</dd>
					</DefinitionList>
				)
			)}
		</>
	);
};
