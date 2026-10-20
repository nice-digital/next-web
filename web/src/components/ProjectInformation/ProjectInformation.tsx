import React, { type FC } from "react";

import {
	ProjectStatus,
	PrioritisationReason,
	PrioritisationDecision,
} from "@/feeds/inDev/types";
import { ProductTypeAcronym } from "@/feeds/publications/types";
import { formatDateStr, stripTime } from "@/utils/datetime";

import { DefinitionList } from "../DefinitionList/DefinitionList";
import { Link } from "../Link/Link";

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
	routingDecision: string | null;
	routingDecisionPublicationDate: string | null;
	routingDecisionRationale: string | null;
	prioritisationDecision: string | null;
	prioritisationReason: string | null;
	prioritisationProgramme: string | null;
	prioritisationBoardDecisionDate: string | null;
	prioritisationRationale: string | null;
	isGuidanceHubPage: boolean;
	content: string | null;
	children?: never;
};

export const ProjectInformation: FC<ProjectInformationProps> = ({
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
	routingDecision,
	routingDecisionPublicationDate,
	routingDecisionRationale,
	prioritisationDecision,
	prioritisationReason,
	prioritisationProgramme,
	prioritisationBoardDecisionDate,
	prioritisationRationale,
	isGuidanceHubPage,
	content,
}) => {
	let prioritisationReasonText = null;
	let prioritisationDecisionText = null;

	if (prioritisationReason) {
		const tsReasonKey =
			prioritisationReason as keyof typeof PrioritisationReason;
		prioritisationReasonText =
			tsReasonKey in PrioritisationReason
				? PrioritisationReason[tsReasonKey]
				: null;
	}

	if (prioritisationDecision) {
		const tsDecisionKey =
			prioritisationDecision as keyof typeof PrioritisationDecision;
		prioritisationDecisionText =
			tsDecisionKey in PrioritisationDecision
				? PrioritisationDecision[tsDecisionKey]
				: null;
	}

	return (
		<>
			{isGuidanceHubPage ? (
				<>{content && <div dangerouslySetInnerHTML={{ __html: content }} />}</>
			) : (
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
						{routingDecision && (
							<>
								<dt>Routing decision:</dt> <dd>{routingDecision}</dd>
							</>
						)}
						{routingDecisionPublicationDate && (
							<>
								<dt>Routing decision publication date:</dt>{" "}
								<dd>
									<time dateTime={stripTime(routingDecisionPublicationDate)}>
										{formatDateStr(routingDecisionPublicationDate)}
									</time>
								</dd>
							</>
						)}
						{routingDecisionRationale && (
							<>
								<dt>Routing decision rationale:</dt>{" "}
								<dd>{routingDecisionRationale}</dd>
							</>
						)}
						{prioritisationDecisionText && (
							<>
								<dt>Prioritisation decision:</dt>
								<dd>{prioritisationDecisionText}</dd>
							</>
						)}
						{prioritisationBoardDecisionDate && (
							<>
								<dt>Prioritisation decision publication date:</dt>{" "}
								<dd>
									<time dateTime={stripTime(prioritisationBoardDecisionDate)}>
										{formatDateStr(prioritisationBoardDecisionDate)}
									</time>
								</dd>
							</>
						)}
						{prioritisationProgramme && (
							<>
								<dt>Prioritisation programme:</dt>{" "}
								<dd>{prioritisationProgramme}</dd>
							</>
						)}
						{prioritisationReasonText && (
							<>
								<dt>Reason for prioritisation decision:</dt>{" "}
								<dd>{prioritisationReasonText}</dd>
							</>
						)}
						{prioritisationRationale && (
							<>
								<dt>Prioritisation decision rationale:</dt>{" "}
								<dd>{prioritisationRationale}</dd>
							</>
						)}
						{process && status !== ProjectStatus.TopicPrioritisation ? (
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
			)}
		</>
	);
};
