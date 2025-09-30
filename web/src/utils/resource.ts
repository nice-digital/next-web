import { IndevPanel, IndevResource, ProjectDetail } from "@/feeds/inDev/inDev";
import {
	BaseContentPart,
	ContentPart,
	EditableContentPart,
	ExternalUrlContentPart,
	FileContent,
	ProductAndResourceBase,
	ResourceType,
	UploadAndConvertContentPart,
	UploadContentPart,
	type ResourceDetail,
} from "@/feeds/publications/types";

import { arrayify, byTitleAlphabetically } from "./array";
import { fetchAndMapContentParts } from "./contentparts";
import { getFileTypeNameFromMime } from "./file";
import { getProjectPath, slugify } from "./url";

export enum ResourceTypeSlug {
	ToolsAndResources = "resources",
	Evidence = "evidence",
	InformationForThePublic = "information-for-the-public",
	History = "history",
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
		const isIndevFile = Object.hasOwn(resource.embedded, "niceIndevFile");

		const mimeType = resource.embedded.niceIndevFile?.mimeType || "text/html";
		const length = resource.embedded.niceIndevFile?.length || 0;
		const resourceTitleId = resource.embedded.niceIndevFile?.resourceTitleId || resource.embedded.niceIndevConvertedDocument?.resourceTitleId;
		const fileName = resource.embedded.niceIndevFile?.resourceTitleId || "";

		const shouldUseNewConsultationComments =
				resource.convertedDocument && isIndevFile ||
				resource.supportsComments ||
				resource.supportsQuestions;

		const isHTML = mimeType === "text/html";
		const isConsultation =
				resource.consultationId > 0 && panel.embedded.niceIndevConsultation;
		const fileSize = isHTML ? null : length;
		const fileTypeName = isHTML ? null : getFileTypeNameFromMime(mimeType);
		const href = shouldUseNewConsultationComments
				? `/consultations/${resource.consultationId}/${resource.consultationDocumentId}`
				: !isHTML
				? `${projectPath}/downloads/${project.reference.toLowerCase()}-${resourceTitleId}.${
						fileName.split(".").slice(-1)[0]
				  }`
				: isConsultation
				? `${projectPath}/consultations/${resourceTitleId}`
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
	if (!resource.contentPartsList) return [];

	const contentParts = resource.contentPartsList;
	const contentPartsArray: ResourceLinkViewModel[] = [];

	const processContentParts = (parts: ContentPart | ContentPart[]) => {
		if (Array.isArray(parts)) {
			parts.forEach((part) => {
				const content = mapContentPartToLink(
					part,
					productID,
					productPath,
					resource,
					resourceTypeSlug
				);
				if (content) contentPartsArray.push(content);
			});
		} else {
			const content = mapContentPartToLink(
				parts,
				productID,
				productPath,
				resource,
				resourceTypeSlug
			);
			if (content) contentPartsArray.push(content);
		}
	};

	processContentParts(contentParts);

	return contentPartsArray;
};

const mapContentPartToLink = (
	part: ContentPart,
	productID: string,
	productPath: string,
	resource: ResourceDetail,
	resourceTypeSlug: ResourceTypeSlug
): ResourceLinkViewModel | null => {
	switch (part.type) {
		case "UploadAndConvertContentPart": {
			const uploadAndConvertContent: UploadAndConvertContentPart = part;
			return {
				title: uploadAndConvertContent.title,
				href: `${productPath}/${resourceTypeSlug}/${slugify(
					uploadAndConvertContent.title
				)}-${resource.uid}-${uploadAndConvertContent.uid}`,
				type: resource.resourceTypeName,
			};
		}
		case "EditableContentPart": {
			const editableContent = part as EditableContentPart;
			return {
				title: editableContent.title,
				href: `${productPath}/${resourceTypeSlug}/${slugify(
					editableContent.title
				)}-${resource.uid}-${editableContent.uid}`,
				type: resource.resourceTypeName,
			};
		}
		case "UploadContentPart": {
			const uploadContent = part as UploadContentPart;
			return {
				title: uploadContent.title,
				href: `${productPath}/downloads/${productID.toUpperCase()}-${slugify(
					uploadContent.title
				)}-${resource.uid}-${uploadContent.uid}.${
					uploadContent.file.fileName.split(".").slice(-1)[0]
				}`,
				fileSize: uploadContent.file.length,
				fileTypeName: getFileTypeNameFromMime(uploadContent.file.mimeType),
				date: part.majorChangeDate
					? part.majorChangeDate
					: resource.lastMajorModificationDate,
				type: resource.resourceTypeName,
			};
		}
		case "ExternalUrlContentPart": {
			const externalLinkContent = part as ExternalUrlContentPart;
			return {
				title: externalLinkContent.title,
				href: externalLinkContent.url,
				type: resource.resourceTypeName,
			};
		}
		default:
			return null;
	}
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
	if (!resource.contentPartsList) return null;

	const contentParts = resource.contentPartsList;
	const uploadAndConvertContentPart =
			fetchAndMapContentParts<UploadAndConvertContentPart>(
				contentParts,
				"UploadAndConvertContentPart"
			),
		uploadContentPart = fetchAndMapContentParts<UploadContentPart>(
			contentParts,
			"UploadContentPart"
		),
		editableContentPart = fetchAndMapContentParts<EditableContentPart>(
			contentParts,
			"EditableContentPart"
		);

	const checkFile = (
		file: FileContent | undefined | null,
		part: BaseContentPart
	): { file: FileContent; part: BaseContentPart } | null =>
		file ? { file, part } : null;

	const uploadPart = arrayify(uploadContentPart).find(
		(p) => p.uid === Number(partUID)
	);
	if (uploadPart) return checkFile(uploadPart.file, uploadPart);

	const editablePart = arrayify(editableContentPart).find(
		(p) => p.uid === Number(partUID)
	);
	if (editablePart) return checkFile(editablePart.pdf, editablePart);

	const convertPart = arrayify(uploadAndConvertContentPart).find(
		(p) => p.uid === Number(partUID)
	);
	if (!convertPart) return null;

	const { pdf } = convertPart;

	if (pdf) return checkFile(pdf, convertPart);

	return null;
};
