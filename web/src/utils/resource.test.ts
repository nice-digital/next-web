import {
	type ResourceDetail,
	ResourceType,
	ProductAndResourceBase,
	FileContent,
	UploadAndConvertContentPart,
} from "@/feeds/publications/types";

import {
	isEvidenceUpdate,
	isSupportingEvidence,
	findContentPartLinks,
	getResourceGroup,
	getResourceGroups,
	findDownloadable,
} from "./resource";

describe("resource utils", () => {
	describe("findContentPartLinks", () => {
		describe("editable content", () => {
			it("should find single editable content part", () => {
				expect(
					findContentPartLinks("NG100", "/guidance/ng100", {
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
						uid: 99,
					} as ResourceDetail)
				).toStrictEqual([
					{
						href: "/guidance/ng100/resources/test-title-99-123",
						title: "Test title",
					},
				]);
			});

			it("should find multiple editable content parts", () => {
				expect(
					findContentPartLinks("NG100", "/guidance/ng100", {
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
						uid: 99,
					} as ResourceDetail)
				).toStrictEqual([
					{ href: "/guidance/ng100/resources/part-1-99-123", title: "Part 1" },
					{ href: "/guidance/ng100/resources/part-2-99-456", title: "Part 2" },
				]);
			});
		});

		describe("external URL", () => {
			it("should find single external url part", () => {
				expect(
					findContentPartLinks("NG100", "/guidance/ng100", {
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
					findContentPartLinks("NG100", "/guidance/ng100", {
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
					findContentPartLinks("NG100", "/guidance/ng100", {
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
						uid: 99,
					} as ResourceDetail)
				).toStrictEqual([
					{
						href: "/guidance/ng100/resources/test-title-99-123",
						title: "Test title",
					},
				]);
			});

			it("should find multiple upload and convert url parts", () => {
				expect(
					findContentPartLinks("NG100", "/guidance/ng100", {
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
						uid: 99,
					} as ResourceDetail)
				).toStrictEqual([
					{ href: "/guidance/ng100/resources/part-1-99-123", title: "Part 1" },
					{ href: "/guidance/ng100/resources/part-2-99-456", title: "Part 2" },
				]);
			});
		});

		describe("upload", () => {
			it("should find single upload part", () => {
				expect(
					findContentPartLinks("NG100", "/guidance/ng100", {
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
						uid: 99,
					} as ResourceDetail)
				).toStrictEqual([
					{
						href: "/guidance/ng100/resources/downloads/NG100-test-title-99-123.xls",
						title: "Test title",
						date: "2017-05-10T00:00:00",
						fileTypeName: "Excel",
						fileSize: 12345,
					},
				]);
			});

			it("should find multiple upload parts", () => {
				expect(
					findContentPartLinks("NG100", "/guidance/ng100", {
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
						uid: 99,
					} as ResourceDetail)
				).toStrictEqual([
					{
						href: "/guidance/ng100/resources/downloads/NG100-part-1-99-123.xls",
						title: "Part 1",
						date: "2017-05-10T00:00:00",
						fileTypeName: "Excel",
						fileSize: 1357,
					},
					{
						href: "/guidance/ng100/resources/downloads/NG100-part-2-99-456.pdf",
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
				getResourceGroup("NG100", "/guidance/ng100", "Some group", [
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
				getResourceGroups("NG100", "/guidance/ng100", [
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

	describe("findDownloadable", () => {
		describe("no content parts", () => {
			it("should return null when there are is no content part list", () => {
				expect(
					findDownloadable(
						{
							embedded: {},
						} as ProductAndResourceBase,
						123
					)
				).toBeNull();
			});

			it("should return null when there are no content parts", () => {
				expect(
					findDownloadable(
						{
							embedded: {
								contentPartList: {
									embedded: {},
								},
							},
						} as ProductAndResourceBase,
						123
					)
				).toBeNull();
			});
		});

		describe("upload part", () => {
			it("should return null when no matching upload part", () => {
				expect(
					findDownloadable(
						{
							embedded: {
								contentPartList: {
									embedded: {
										uploadContentPart: {
											uid: 987,
										},
									},
								},
							},
						} as ProductAndResourceBase,
						123
					)
				).toBeNull();
			});

			it("should return upload part file with matching part id", () => {
				const file = {
					fileName: "test.pdf",
				} as FileContent;
				const part = {
					embedded: {
						file,
					},
					uid: 123,
				};
				expect(
					findDownloadable(
						{
							embedded: {
								contentPartList: {
									embedded: {
										uploadContentPart: part,
									},
								},
							},
						} as ProductAndResourceBase,
						123
					)
				).toStrictEqual({ file, part });
			});
		});

		describe("editable content part", () => {
			it("should return null when no matching editable part", () => {
				expect(
					findDownloadable(
						{
							embedded: {
								contentPartList: {
									embedded: {
										editableContentPart: {
											uid: 987,
										},
									},
								},
							},
						} as ProductAndResourceBase,
						123
					)
				).toBeNull();
			});

			it("should return editable part file with matching part id", () => {
				const pdfFile = {
					fileName: "test.pdf",
				} as FileContent;
				const part = {
					embedded: {
						pdfFile,
					},
					uid: 123,
				};
				expect(
					findDownloadable(
						{
							embedded: {
								contentPartList: {
									embedded: {
										editableContentPart: part,
									},
								},
							},
						} as ProductAndResourceBase,
						123
					)
				).toStrictEqual({ file: pdfFile, part });
			});
		});

		describe("upload and convert content part", () => {
			it("should return null when no matching convert part", () => {
				expect(
					findDownloadable(
						{
							embedded: {
								contentPartList: {
									embedded: {
										uploadAndConvertContentPart: {
											uid: 987,
										},
									},
								},
							},
						} as ProductAndResourceBase,
						123
					)
				).toBeNull();
			});

			it.each<[string, "pdfFile" | "mobiFile" | "epubFile"]>([
				["pdf", "pdfFile"],
				["mobi", "mobiFile"],
				["epub", "epubFile"],
			])(
				"should return convert part %file file with matching part id",
				(extension, filePropertyName) => {
					const file = {
						fileName: `test.${extension}`,
					} as FileContent;
					const part = {
						embedded: {
							[filePropertyName]: file,
						} as unknown as UploadAndConvertContentPart["embedded"],
						uid: 123,
					};
					expect(
						findDownloadable(
							{
								embedded: {
									contentPartList: {
										embedded: {
											uploadAndConvertContentPart: part,
										},
									},
								},
							} as ProductAndResourceBase,
							123
						)
					).toStrictEqual({ file, part });
				}
			);
		});
	});
});
