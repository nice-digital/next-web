import { ResourceType, type ResourceDetail } from "@/feeds/publications/types";

import { arrayify, byTitleAlphabetically } from "./array";
import { getFileTypeNameFromMime } from "./file";
import { slugify } from "./url";

export type ResourceLinkViewModel = {
	title: string;
	href: string;
	fileTypeName?: string;
	/** In bytes */
	fileSize?: number;
	/** ISO formatted date string */
	date?: string;
};

export type ResourceSubGroupViewModel = {
	title: string;
	resourceLinks: ResourceLinkViewModel[];
};

export type ResourceGroupViewModel = {
	title: string;
	subGroups: ResourceSubGroupViewModel[];
};

export const getResourceSubGroups = (
	resources: ResourceDetail[]
): ResourceSubGroupViewModel[] =>
	resources
		.reduce((groups, current) => {
			const group = groups.find((g) => g.title === current.resourceTypeName);
			if (!group) {
				groups.push({
					title: current.resourceTypeName,
					resourceLinks: findContentPartLinks(current),
				});
			} else {
				group.resourceLinks.push(...findContentPartLinks(current));
			}
			return groups;
		}, [] as ResourceSubGroupViewModel[])
		.sort(byTitleAlphabetically);

export const getResourceGroups = (
	resources: ResourceDetail[]
): ResourceGroupViewModel[] => {
	return resources
		.reduce((groups, current) => {
			const group = groups.find((g) => g.title === current.resourceTypeName);
			if (!group) {
				groups.push({
					title: current.resourceTypeName,
					subGroups: [
						{
							title: current.resourceTypeName,
							resourceLinks: findContentPartLinks(current),
						},
					],
				});
			} else {
				group.subGroups[0].resourceLinks.push(...findContentPartLinks(current));
			}
			return groups;
		}, [] as ResourceGroupViewModel[])
		.sort(byTitleAlphabetically);
};

export const findContentPartLinks = (
	resource: ResourceDetail
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
			href: `resources/${slugify(part.title)}-${part.uid}`,
		})),
		...arrayify(editableContentPart).map((part) => ({
			title: part.title,
			href: `resources/${slugify(part.title)}-${part.uid}`,
		})),
		...arrayify(uploadContentPart).map((part) => ({
			title: part.title,
			href: `resources/downloads/${slugify(part.title)}-${part.uid}.${
				part.embedded.file.fileName.split(".")[1]
			}`,
			fileSize: part.embedded.file.length,
			fileTypeName: getFileTypeNameFromMime(part.embedded.file.mimeType),
			date: resource.lastMajorModificationDate,
		})),
		...arrayify(externalUrlContentPart).map((part) => ({
			title: part.title,
			href: part.url,
		})),
	].sort(byTitleAlphabetically);
};

export const isEvidenceUpdate = (resource: ResourceDetail): boolean =>
	resource.resourceType === ResourceType.EvidenceUpdate;

export const isSupportingEvidence = (resource: ResourceDetail): boolean =>
	resource.resourceType !== ResourceType.EvidenceUpdate;
