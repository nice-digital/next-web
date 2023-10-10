import { IndevPanel, IndevResource, ProjectDetail } from "@/feeds/inDev/inDev";
import {
	BaseContentPart,
	FileContent,
	ProductAndResourceBase,
	ResourceType,
	type ResourceDetail,
} from "@/feeds/publications/types";

import { arrayify, byTitleAlphabetically } from "./array";
import { getFileTypeNameFromMime } from "./file";
import { getProjectPath, slugify } from "./url";

export enum ResourceTypeSlug {
	ToolsAndResources = "resources",
	Evidence = "evidence",
	InformationForThePublic = "information-for-the-public",
}

export type ResourceLinkViewModel = {
	title: string;
	href: string;
	fileTypeName?: string | null;
	/** In bytes */
	fileSize?: number | null;
	/** ISO formatted date string */
	date?: string;
	type: string;
};

export type ResourceSubGroupViewModel = {
	title: string;
	resourceLinks: ResourceLinkViewModel[];
};

export type ResourceGroupViewModel = {
	title: string;
	subGroups: ResourceSubGroupViewModel[];
};

export const getResourceGroup = (
	productID: string,
	productPath: string,
	title: string,
	resources: ResourceDetail[],
	resourceTypeSlug: ResourceTypeSlug
): ResourceGroupViewModel => ({
	title,
	subGroups: resources
		.reduce((subGroups, current) => {
			let subGroup = subGroups.find(
				({ title }) => title === current.resourceTypeName
			);

			if (!subGroup) {
				subGroup = {
					title: current.resourceTypeName,
					resourceLinks: [],
				};

				subGroups.push(subGroup);
			}

			subGroup.resourceLinks = [
				...subGroup.resourceLinks,
				...findContentPartLinks(
					productID,
					productPath,
					current,
					resourceTypeSlug
				),
			];

			return subGroups;
		}, [] as ResourceSubGroupViewModel[])
		.sort(byTitleAlphabetically),
});

export const getResourceGroups = (
	productID: string,
	productPath: string,
	resources: ResourceDetail[],
	resourceTypeSlug: ResourceTypeSlug
): ResourceGroupViewModel[] =>
	resources
		.reduce((groups, current) => {
			let group = groups.find(
				({ title }) => title === current.resourceTypeName
			);

			if (!group) {
				group = getResourceGroup(
					productID,
					productPath,
					current.resourceTypeName,
					resources.filter(
						(r) => r.resourceTypeName === current.resourceTypeName
					),
					resourceTypeSlug
				);

				groups.push(group);
			}

			return groups;
		}, [] as ResourceGroupViewModel[])
		.sort(byTitleAlphabetically);

export type GetInDevResourceLinkArgs = {
	resource: IndevResource;
	panel: IndevPanel;
	project: ProjectDetail;
};

export const getInDevResourceLink = ({
	resource,
	panel,
	project,
}: GetInDevResourceLinkArgs): ResourceLinkViewModel => {
	if (!resource.embedded) {
		if (!resource.externalUrl)
			throw Error(
				`Found resource (${resource.title}) with nothing embedded and no external URL`
			);

		return {
			title: resource.title,
			href: resource.externalUrl,
			fileTypeName: null,
			fileSize: null,
			date: resource.publishedDate,
			type: panel.title,
		};
	} else {
		const projectPath = getProjectPath(project);

		const { mimeType, length, resourceTitleId, fileName } =
				resource.embedded.niceIndevFile,
			shouldUseNewConsultationComments =
				(resource.convertedDocument && resource.consultationId !== 0) ||
				resource.supportsComments ||
				resource.supportsQuestions,
			isHTML = mimeType === "text/html",
			isConsultation =
				resource.consultationId > 0 && panel.embedded.niceIndevConsultation,
			fileSize = isHTML || resource.convertedDocument ? null : length,
			fileTypeName =
				isHTML || resource.convertedDocument
					? null
					: getFileTypeNameFromMime(mimeType),
			href = shouldUseNewConsultationComments
				? `/consultations/${resource.consultationId}/${resource.consultationDocumentId}`
				: !isHTML
				? `${projectPath}/downloads/${project.reference.toLowerCase()}-${resourceTitleId}.${
						fileName.split(".").slice(-1)[0]
				  }`
				: isConsultation
				? `${projectPath}/consultations/${resourceTitleId}`
				: resource.convertedDocument
				? `${projectPath}/converteddocument/${resourceTitleId}`
				: `${projectPath}/documents/${resourceTitleId}`;

		return {
			title: resource.title,
			href,
			fileTypeName,
			fileSize,
			date: resource.publishedDate,
			type: panel.title,
		};
	}
};

export const findContentPartLinks = (
	productID: string,
	productPath: string,
	resource: ResourceDetail,
	resourceTypeSlug: ResourceTypeSlug
): ResourceLinkViewModel[] => {
	const { contentPartList } = resource.embedded;

	if (!contentPartList) return [];

	const {
		uploadAndConvertContentPart,
		editableContentPart,
		externalUrlContentPart,
		uploadContentPart,
	} = contentPartList.embedded;

	return [
		...arrayify(uploadAndConvertContentPart).map((part) => ({
			title: part.title,
			href: `${productPath}/${resourceTypeSlug}/${slugify(part.title)}-${
				resource.uid
			}-${part.uid}`,
			type: resource.resourceTypeName,
		})),
		...arrayify(editableContentPart).map((part) => ({
			title: part.title,
			href: `${productPath}/${resourceTypeSlug}/${slugify(part.title)}-${
				resource.uid
			}-${part.uid}`,
			type: resource.resourceTypeName,
		})),
		...arrayify(uploadContentPart).map((part) => ({
			title: part.title,
			href: `${productPath}/downloads/${productID.toUpperCase()}-${slugify(
				part.title
			)}-${resource.uid}-${part.uid}.${
				part.embedded.file.fileName.split(".").slice(-1)[0]
			}`,
			fileSize: part.embedded.file.length,
			fileTypeName: getFileTypeNameFromMime(part.embedded.file.mimeType),
			date: resource.lastMajorModificationDate,
			type: resource.resourceTypeName,
		})),
		...arrayify(externalUrlContentPart).map((part) => ({
			title: part.title,
			href: part.url,
			type: resource.resourceTypeName,
		})),
	];
};

export const isEvidenceUpdate = (resource: ResourceDetail): boolean =>
	resource.resourceType === ResourceType.EvidenceUpdate;

export const isSupportingEvidence = (resource: ResourceDetail): boolean =>
	resource.resourceType !== ResourceType.EvidenceUpdate;

/**
 * Looks for a 'downloadable' with the given extension within the content part list of the given resource.
 *
 * A 'downlable' being either:
 * - an upload part
 * - PDF version of an editable content part
 * - PDF (or mobi/epub) from an upload and convert content part
 *
 * @param resource The resource in which to look for downloadables
 * @param partUID The numeric UID of the content part part
 *
 * @returns The file to download, if there is one, otherwise null
 */
export const findDownloadable = (
	resource: ProductAndResourceBase,
	partUID: number
): { file: FileContent; part: BaseContentPart } | null => {
	if (!resource.embedded.contentPartList) return null;

	const {
		uploadAndConvertContentPart,
		uploadContentPart,
		editableContentPart,
	} = resource.embedded.contentPartList.embedded;

	const checkFile = (
		file: FileContent | undefined | null,
		part: BaseContentPart
	): { file: FileContent; part: BaseContentPart } | null =>
		file ? { file, part } : null;

	const uploadPart = arrayify(uploadContentPart).find(
		(p) => p.uid === Number(partUID)
	);
	if (uploadPart) return checkFile(uploadPart.embedded.file, uploadPart);

	const editablePart = arrayify(editableContentPart).find(
		(p) => p.uid === Number(partUID)
	);
	if (editablePart)
		return checkFile(editablePart.embedded.pdfFile, editablePart);

	const convertPart = arrayify(uploadAndConvertContentPart).find(
		(p) => p.uid === Number(partUID)
	);
	if (!convertPart) return null;

	const { pdfFile, epubFile, mobiFile } = convertPart.embedded;

	if (pdfFile) return checkFile(pdfFile, convertPart);

	if (epubFile) return checkFile(epubFile, convertPart);

	if (mobiFile) return checkFile(mobiFile, convertPart);

	return null;
};
