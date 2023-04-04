import { waitFor } from "@testing-library/react";

import {
	ProjectStatus,
	type Project,
	ProjectGroup,
	ProjectType,
} from "@/feeds/inDev/types";
import {
	getProductDetail,
	ProductGroup,
	ProductTypeAcronym,
	type ProductLite,
	type ProductDetail,
	FeedPath,
} from "@/feeds/publications/publications";
import ind1001 from "@/mockData/publications/feeds/product/ind1001.json";
import { axiosJSONMock } from "@/test-utils/feeds";

import {
	getProjectPath,
	getProductPath,
	getPublicationPdfDownloadPath,
} from "./url";

const slug =
	"ind1001-test-indicator-ind-1001-the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-more-or-audit-c-score-of-5-or-more-in-the-preceding-2-years-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-recorded";

describe("URL utils", () => {
	describe("getProjectPath", () => {
		it("should return null for advice projects", () => {
			expect(
				getProjectPath({
					projectGroup: ProjectGroup.Advice,
					projectType: ProjectType.MIB,
					reference: "GID-MIB123",
					status: ProjectStatus.InProgress,
				})
			).toBeNull();
		});

		describe.each([
			[ProjectGroup.Other, ProjectType.IND, "indicators"],
			[ProjectGroup.Other, ProjectType.NGC, "guidance"],
			[ProjectGroup.Guidance, ProjectType.NG, "guidance"],
			[ProjectGroup.Standard, ProjectType.QS, "guidance"],
		])(
			"project group of %s and project type of %s should be %s",
			(projectGroup, projectType, groupSlug) => {
				it.each([
					[ProjectStatus.Discontinued, "discontinued"],
					[ProjectStatus.ImpactedByCOVID19, "indevelopment"],
					[ProjectStatus.InProgress, "indevelopment"],
					[ProjectStatus.Proposed, "awaiting-development"],
					[ProjectStatus.Referred, "indevelopment"],
					[ProjectStatus.Suspended, "indevelopment"],
					[ProjectStatus.TopicSelection, "topic-selection"],
				])(
					"should return correct path for status %s of %s",
					(status, expectedPathSegment) => {
						expect(
							getProjectPath({
								projectGroup,
								projectType,
								status,
								reference: `GID-${projectType}123`,
							})
						).toBe(
							`/${groupSlug}/${expectedPathSegment}/gid-${projectType.toLowerCase()}123`
						);
					}
				);
			}
		);
	});

	describe("getProductPath", () => {
		it.each([
			[ProductGroup.Guidance, ProductTypeAcronym.TA, "/guidance/ta123"],
			[ProductGroup.Guideline, ProductTypeAcronym.NG, "/guidance/ng123"],
			[ProductGroup.Advice, ProductTypeAcronym.MIB, "/advice/mib123"],
			[ProductGroup.Standard, ProductTypeAcronym.QS, "/guidance/qs123"],
			[ProductGroup.Corporate, ProductTypeAcronym.ECD, "/corporate/ecd123"],
			[ProductGroup.Corporate, ProductTypeAcronym.PMG, "/process/pmg123"],
			[
				ProductGroup.Other,
				ProductTypeAcronym.IND,
				"/indicators/ind123-product",
			],
		])(
			"should return correct path for %s (e.g. %s) products",
			(groupName, productTypeAcronym, expectedPath) => {
				expect(
					getProductPath({
						id: `${productTypeAcronym}123`,
						productType: productTypeAcronym,
						productGroup: groupName,
						title: "Product",
					} as ProductLite)
				).toBe(expectedPath);
			}
		);
	});

	describe("getPublicationPdfDownloadPath", () => {
		it("should return a publication download path", async () => {
			const product = await getProductDetail("IND1001");

			await waitFor(() => {
				expect(
					getPublicationPdfDownloadPath(
						product as unknown as ProductDetail,
						ProductGroup.Other
					)
				).toBe(`/indicators/${slug}/IND1001.pdf`);
			});
		});

		it("should return null when there's no upload and convert part", async () => {
			axiosJSONMock.reset();
			axiosJSONMock.onGet(new RegExp(FeedPath.ProductDetail)).reply(200, {
				...ind1001,
				_embedded: {
					"nice.publications:content-part-list": {
						_embedded: [],
					},
				},
			});

			const product = await getProductDetail("IND1001");

			if (!product) throw Error("Product should not be null");

			expect(
				getPublicationPdfDownloadPath(product, ProductGroup.Other)
			).toBeNull();
		});
	});
});
