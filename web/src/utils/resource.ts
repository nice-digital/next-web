import { ResourceType, type ResourceDetail } from "@/feeds/publications/types";

import { arrayify, byTitleAlphabetically } from "./array";
import { getFileTypeNameFromMime } from "./file";
import { slugify } from "./url";

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
	title: string,
	resources: ResourceDetail[]
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
				...findContentPartLinks(current),
			].sort(byTitleAlphabetically);

			return subGroups;
		}, [] as ResourceSubGroupViewModel[])
		.sort(byTitleAlphabetically),
});

export const getResourceGroups = (
	resources: ResourceDetail[]
): ResourceGroupViewModel[] =>
	resources
		.reduce((groups, current) => {
			let group = groups.find(
				({ title }) => title === current.resourceTypeName
			);

			if (!group) {
				group = getResourceGroup(
					current.resourceTypeName,
					resources.filter(
						(r) => r.resourceTypeName === current.resourceTypeName
					)
				);

				groups.push(group);
			}

			return groups;
		}, [] as ResourceGroupViewModel[])
		.sort(byTitleAlphabetically);

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
			type: resource.resourceTypeName,
		})),
		...arrayify(editableContentPart).map((part) => ({
			title: part.title,
			href: `resources/${slugify(part.title)}-${part.uid}`,
			type: resource.resourceTypeName,
		})),
		...arrayify(uploadContentPart).map((part) => ({
			title: part.title,
			href: `resources/downloads/${slugify(part.title)}-${part.uid}.${
				part.embedded.file.fileName.split(".")[1]
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
	].sort(byTitleAlphabetically);
};

export const isEvidenceUpdate = (resource: ResourceDetail): boolean =>
	resource.resourceType === ResourceType.EvidenceUpdate;

export const isSupportingEvidence = (resource: ResourceDetail): boolean =>
	resource.resourceType !== ResourceType.EvidenceUpdate;
