import React, { type FC } from "react";

import { ProjectStatus, TopicSelectionReason } from "@/feeds/inDev/types";
import { ProductTypeAcronym } from "@/feeds/publications/types";
import { formatDateStr, stripTime } from "@/utils/datetime";

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
				<dl aria-label="Status">
					<dt>Status:</dt> <dd>{status}</dd>
				</dl>
			)}
			{technologyType && (
				<dl aria-label="Technology type">
					<dt>Technology type:</dt> <dd>{technologyType}</dd>
				</dl>
			)}
			{topicSelectionDecision && (
				<dl aria-label="Decision">
					<dt>Decision:</dt> <dd>{topicSelectionDecision}</dd>
				</dl>
			)}
			{topicSelectionReasonText && (
				<dl aria-label="Reason for decision">
					<dt>Reason for decision:</dt> <dd>{topicSelectionReasonText}</dd>
				</dl>
			)}
			{topicSelectionFurtherInfo && (
				<dl aria-label="Further information">
					<dt>Further information:</dt> <dd>{topicSelectionFurtherInfo}</dd>
				</dl>
			)}
			{process && status !== ProjectStatus.TopicSelection ? (
				projectType == ProductTypeAcronym.NG ? (
					<dl aria-label="Developed as">
						<dt>Developed as:</dt> <dd>{process}</dd>
					</dl>
				) : (
					<dl aria-label="Process">
						<dt>Process:</dt> <dd>{process}</dd>
					</dl>
				)
			) : null}
			{/* TODO remove 'Process' and 'Developed as' if the logic above covers it */}
			{/* <p>Process: {process}</p> */}
			{/* <p>Developed as: {developedAs}</p> */}
			{description && (
				<dl aria-label="Description">
					<dt>Description:</dt>
					<dd dangerouslySetInnerHTML={{ __html: description }} />
				</dl>
			)}
			{idNumber && (
				<dl aria-label="ID number">
					<dt>ID number:</dt> <dd>{idNumber}</dd>
				</dl>
			)}
			{/* TODO check formatting of referral date */}
			{process == "MT" && referralDate ? (
				<dl aria-label="Notification date">
					<dt>Notification date:</dt> <dd>{referralDate}</dd>
				</dl>
			) : (
				referralDate && (
					<dl aria-label="Referral date">
						<dt>Referral date:</dt>
						<dd>
							<time dateTime={stripTime(referralDate)}>
								&nbsp;{formatDateStr(referralDate)}
							</time>
						</dd>
					</dl>
				)
			)}
		</>
	);
};
