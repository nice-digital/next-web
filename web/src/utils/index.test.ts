import { waitFor } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";

import { Project, ProjectStatus } from "@/feeds/inDev/types";
import { client } from "@/feeds/index";
import { getProductDetail } from "@/feeds/publications/publications";
import {
	ProductGroup,
	ProductLite,
	ProductTypeAcronym,
	ProductDetail,
} from "@/feeds/publications/types";
import mockProduct from "@/mockData/publications/feeds/products/indicator.json";

import {
	stripTime,
	formatDateStr,
	getProjectPath,
	getProductPath,
	getPublicationDownloadPath,
} from "./";

const axiosMock = new MockAdapter(client, { onNoMatch: "throwException" });

const slug =
	"ind-1001-test-indicator-ind-1001-the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-more-or-audit-c-score-of-5-or-more-in-the-preceding-2-years-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-recorded";

describe("utils", () => {
	describe("stripTime", () => {
		it("should strip time from ISO formatted string", () => {
			expect(stripTime("2020-10-05T12:27:21.5437767")).toBe("2020-10-05");
		});
	});

	describe("formatDateStr", () => {
		it("should format ISO date string as NICE formatted date string", () => {
			expect(formatDateStr("2020-10-05T12:27:21.5437767")).toBe(
				"5 October 2020"
			);
		});
		it("should format ISO date string as NICE formatted date string (short version)", () => {
			expect(formatDateStr("2020-10-05T12:27:21.5437767", true)).toBe(
				"5/10/2020"
			);
		});
	});

	describe("getProjectPath", () => {
		it("should return null for advice projects", () => {
			expect(
				getProjectPath({
					projectGroup: ProductGroup.Advice,
				} as unknown as Project)
			).toBeNull();
		});

		it("should return lowercase awaiting development gid url for proposed status projects", () => {
			expect(
				getProjectPath({
					projectGroup: ProductGroup.Guidance,
					status: ProjectStatus.Proposed,
					reference: "GID-TA123",
				} as unknown as Project)
			).toBe("/guidance/awaiting-development/gid-ta123");
		});

		it("should return lowercase guidance gid url for non-proposed status projects", () => {
			expect(
				getProjectPath({
					projectGroup: ProductGroup.Guidance,
					status: ProjectStatus.InProgress,
					reference: "GID-TA123",
				} as unknown as Project)
			).toBe("/guidance/indevelopment/gid-ta123");
		});
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
					} as unknown as ProductLite)
				).toBe(expectedPath);
			}
		);
	});

	describe("getPublicationDownloadPath", () => {
		it("should return a publication download path", async () => {
			axiosMock.onGet(/\/feeds\/product/).reply(200, mockProduct);
			const product = await getProductDetail("ind-1001");

			await waitFor(() => {
				expect(
					getPublicationDownloadPath(product as unknown as ProductDetail)
				).toBe(`indicators/${slug}/${slug}-68183483719102410.pdf`);
			});
		});
	});
});
