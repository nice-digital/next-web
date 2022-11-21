import { type ResourceDetail, ResourceType } from "@/feeds/publications/types";

import {
	isEvidenceUpdate,
	isSupportingEvidence,
	findContentPartLinks,
	getResourceGroup,
	getResourceGroups,
} from "./resource";

describe("resource utils", () => {
	describe("findContentPartLinks", () => {
		describe("editable content", () => {
			it("should find single editable content part", () => {
				expect(
					findContentPartLinks({
						embedded: {
							contentPartList: {
								embedded: {
									editableContentPart: {
										title: "Test title",
										uid: 123,
									},
								},
							},
						},
					} as ResourceDetail)
				).toStrictEqual([
					{ href: "resources/test-title-123", title: "Test title" },
				]);
			});

			it("should find multiple editable content parts", () => {
				expect(
					findContentPartLinks({
						embedded: {
							contentPartList: {
								embedded: {
									editableContentPart: [
										{
											title: "Part 1",
											uid: 123,
										},
										{
											title: "Part 2",
											uid: 456,
										},
									],
								},
							},
						},
					} as ResourceDetail)
				).toStrictEqual([
					{ href: "resources/part-1-123", title: "Part 1" },
					{ href: "resources/part-2-456", title: "Part 2" },
				]);
			});
		});

		describe("external URL", () => {
			it("should find single external url part", () => {
				expect(
					findContentPartLinks({
						embedded: {
							contentPartList: {
								embedded: {
									externalUrlContentPart: {
										title: "Test title",
										url: "https://someurl.com",
									},
								},
							},
						},
					} as ResourceDetail)
				).toStrictEqual([{ href: "https://someurl.com", title: "Test title" }]);
			});

			it("should find multiple external url parts", () => {
				expect(
					findContentPartLinks({
						embedded: {
							contentPartList: {
								embedded: {
									externalUrlContentPart: [
										{
											title: "Link 1",
											url: "https://link1.com",
										},
										{
											title: "Link 2",
											url: "https://link2.com",
										},
									],
								},
							},
						},
					} as ResourceDetail)
				).toStrictEqual([
					{ href: "https://link1.com", title: "Link 1" },
					{ href: "https://link2.com", title: "Link 2" },
				]);
			});
		});

		describe("upload and convert", () => {
			it("should find single upload and convert url part", () => {
				expect(
					findContentPartLinks({
						embedded: {
							contentPartList: {
								embedded: {
									uploadAndConvertContentPart: {
										title: "Test title",
										uid: 123,
									},
								},
							},
						},
					} as ResourceDetail)
				).toStrictEqual([
					{ href: "resources/test-title-123", title: "Test title" },
				]);
			});

			it("should find multiple upload and convert url parts", () => {
				expect(
					findContentPartLinks({
						embedded: {
							contentPartList: {
								embedded: {
									uploadAndConvertContentPart: [
										{
											title: "Part 1",
											uid: 123,
										},
										{
											title: "Part 2",
											uid: 456,
										},
									],
								},
							},
						},
					} as ResourceDetail)
				).toStrictEqual([
					{ href: "resources/part-1-123", title: "Part 1" },
					{ href: "resources/part-2-456", title: "Part 2" },
				]);
			});
		});

		describe("upload", () => {
			it("should find single upload part", () => {
				expect(
					findContentPartLinks({
						embedded: {
							contentPartList: {
								embedded: {
									uploadContentPart: {
										title: "Test title",
										uid: 123,
										embedded: {
											file: {
												fileName: "any thing.xls",
												length: 12345,
												mimeType: "application/vnd.ms-excel",
											},
										},
									},
								},
							},
						},
						lastMajorModificationDate: "2017-05-10T00:00:00",
					} as ResourceDetail)
				).toStrictEqual([
					{
						href: "resources/downloads/test-title-123.xls",
						title: "Test title",
						date: "2017-05-10T00:00:00",
						fileTypeName: "Excel",
						fileSize: 12345,
					},
				]);
			});

			it("should find multiple upload parts", () => {
				expect(
					findContentPartLinks({
						embedded: {
							contentPartList: {
								embedded: {
									uploadContentPart: [
										{
											title: "Part 1",
											uid: 123,
											embedded: {
												file: {
													fileName: "any thing.xls",
													length: 1357,
													mimeType: "application/vnd.ms-excel",
												},
											},
										},
										{
											title: "Part 2",
											uid: 456,
											embedded: {
												file: {
													fileName: "any thing.pdf",
													length: 2468,
													mimeType: "application/pdf",
												},
											},
										},
									],
								},
							},
						},
						lastMajorModificationDate: "2017-05-10T00:00:00",
					} as ResourceDetail)
				).toStrictEqual([
					{
						href: "resources/downloads/part-1-123.xls",
						title: "Part 1",
						date: "2017-05-10T00:00:00",
						fileTypeName: "Excel",
						fileSize: 1357,
					},
					{
						href: "resources/downloads/part-2-456.pdf",
						title: "Part 2",
						date: "2017-05-10T00:00:00",
						fileTypeName: "PDF",
						fileSize: 2468,
					},
				]);
			});
		});
	});

	describe("isEvidenceUpdate", () => {
		it("should return true when the resource is an evidence update", () => {
			expect(
				isEvidenceUpdate({
					resourceType: ResourceType.EvidenceUpdate,
				} as ResourceDetail)
			).toBe(true);
		});

		it("should return false when the resource is not an evidence update", () => {
			expect(
				isEvidenceUpdate({
					resourceType: ResourceType.EvidenceReview,
				} as ResourceDetail)
			).toBe(false);
		});
	});

	describe("isSupportingEvidence", () => {
		it("should return true when the resource is not an evidence update", () => {
			expect(
				isSupportingEvidence({
					resourceType: ResourceType.EvidenceReview,
				} as ResourceDetail)
			).toBe(true);
		});

		it("should return false when the resource is an evidence update", () => {
			expect(
				isSupportingEvidence({
					resourceType: ResourceType.EvidenceUpdate,
				} as ResourceDetail)
			).toBe(false);
		});
	});

	describe("getResourceGroup", () => {
		it("should group resources by resource type", () => {
			expect(
				getResourceGroup("Some group", [
					{
						resourceTypeName: "First group",
						embedded: {
							contentPartList: {
								embedded: {
									externalUrlContentPart: [
										{
											title: "First group link 1",
											url: "https://firstgrouplink1.com",
										},
										{
											title: "First group link 2",
											url: "https://firstgrouplink2.com",
										},
									],
								},
							},
						},
					} as ResourceDetail,
					{
						resourceTypeName: "Second group",
						embedded: {
							contentPartList: {
								embedded: {
									externalUrlContentPart: [
										{
											title: "Second group link 1",
											url: "https://secondgrouplink1.com",
										},
									],
								},
							},
						},
					} as ResourceDetail,
					{
						resourceTypeName: "First group",
						embedded: {
							contentPartList: {
								embedded: {
									externalUrlContentPart: [
										{
											title: "First group link 3",
											url: "https://firstgrouplink3.com",
										},
									],
								},
							},
						},
					} as ResourceDetail,
				])
			).toStrictEqual({
				title: "Some group",
				subGroups: [
					{
						title: "First group",
						resourceLinks: [
							{
								title: "First group link 1",
								href: "https://firstgrouplink1.com",
							},
							{
								title: "First group link 2",
								href: "https://firstgrouplink2.com",
							},
							{
								title: "First group link 3",
								href: "https://firstgrouplink3.com",
							},
						],
					},
					{
						title: "Second group",
						resourceLinks: [
							{
								title: "Second group link 1",
								href: "https://secondgrouplink1.com",
							},
						],
					},
				],
			});
		});
	});

	describe("getResourceGroups", () => {
		it("should group resources by resource type", () => {
			expect(
				getResourceGroups([
					{
						resourceTypeName: "First group",
						embedded: {
							contentPartList: {
								embedded: {
									externalUrlContentPart: [
										{
											title: "First group link 1",
											url: "https://firstgrouplink1.com",
										},
										{
											title: "First group link 2",
											url: "https://firstgrouplink2.com",
										},
									],
								},
							},
						},
					} as ResourceDetail,
					{
						resourceTypeName: "Second group",
						embedded: {
							contentPartList: {
								embedded: {
									externalUrlContentPart: [
										{
											title: "Second group link 1",
											url: "https://secondgrouplink1.com",
										},
									],
								},
							},
						},
					} as ResourceDetail,
					{
						resourceTypeName: "First group",
						embedded: {
							contentPartList: {
								embedded: {
									externalUrlContentPart: [
										{
											title: "First group link 3",
											url: "https://firstgrouplink3.com",
										},
									],
								},
							},
						},
					} as ResourceDetail,
				])
			).toStrictEqual([
				{
					title: "First group",
					subGroups: [
						{
							title: "First group",
							resourceLinks: [
								{
									title: "First group link 1",
									href: "https://firstgrouplink1.com",
								},
								{
									title: "First group link 2",
									href: "https://firstgrouplink2.com",
								},
								{
									title: "First group link 3",
									href: "https://firstgrouplink3.com",
								},
							],
						},
					],
				},
				{
					title: "Second group",
					subGroups: [
						{
							title: "Second group",
							resourceLinks: [
								{
									title: "Second group link 1",
									href: "https://secondgrouplink1.com",
								},
							],
						},
					],
				},
			]);
		});
	});
});
