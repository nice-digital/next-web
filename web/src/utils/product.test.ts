import MockAdapter from "axios-mock-adapter";

import { client } from "@/feeds/index";
import { ProductDetail } from "@/feeds/publications/types";
import mockIndicatorSubTypes from "@/mockData/publications/feeds/products/indicator-sub-types.json";
import mockProduct from "@/mockData/publications/feeds/products/indicator.json";

import { validateRouteParams, getChapterLinks } from "./product";

const axiosMock = new MockAdapter(client, {
	onNoMatch: "throwException",
});

describe("product utils", () => {
	const slug =
		"ind1001-test-indicator-ind-1001-the-percentage-of-patients-with-one-or-more-of-the-following-conditions-chd-atrial-fibrillation-chronic-heart-failure-stroke-or-tia-diabetes-or-dementia-with-a-fast-score-of-3-or-more-or-audit-c-score-of-5-or-more-in-the-preceding-2-years-who-have-received-brief-intervention-to-help-them-reduce-their-alcohol-related-risk-within-3-months-of-the-score-being-recorded";

	beforeEach(() => {
		axiosMock.onGet(/\/feeds\/product\//).reply(200, mockProduct);

		axiosMock
			.onGet(/\/feeds\/indicatorsubtypes/)
			.reply(200, mockIndicatorSubTypes);
	});
	describe("getChapterLinks", () => {
		it("should have no chapters when there's no upload and convert parts", () => {
			const chapterLinks = getChapterLinks({
				id: "IND1",
				title: "Test indicator",
				embedded: {
					contentPartList: {
						embedded: {},
					},
				},
			} as ProductDetail);

			expect(chapterLinks).toStrictEqual([]);
		});

		it("should prepend overview link when there is a product summary", () => {
			const chapterLinks = getChapterLinks({
				id: "IND1",
				title: "Test indicator",
				productType: "IND",
				summary: "Some overview text",
				embedded: {
					contentPartList: {
						embedded: {
							uploadAndConvertContentPart: [
								{
									embedded: {
										htmlContent: {
											embedded: {
												htmlChapterContentInfo: [
													{
														chapterSlug: "chapter-1",
														title: "Chapter 1",
													},
												],
											},
										},
									},
								},
							],
						},
					},
				},
			} as ProductDetail);

			expect(chapterLinks).toStrictEqual([
				{
					title: "Overview",
					url: "/indicators/ind1-test-indicator",
				},
				{
					title: "Chapter 1",
					url: "/indicators/ind1-test-indicator/chapters/chapter-1",
				},
			]);
		});

		it("should exclude chapter named overview", () => {
			const chapterLinks = getChapterLinks({
				id: "IND1",
				title: "Test indicator",
				productType: "IND",
				summary: "Some overview text",
				embedded: {
					contentPartList: {
						embedded: {
							uploadAndConvertContentPart: [
								{
									embedded: {
										htmlContent: {
											embedded: {
												htmlChapterContentInfo: [
													{
														chapterSlug: "overview",
														title: "Overview",
													},
													{
														chapterSlug: "chapter-1",
														title: "Chapter 1",
													},
												],
											},
										},
									},
								},
							],
						},
					},
				},
			} as ProductDetail);

			expect(chapterLinks).toStrictEqual([
				{
					title: "Overview",
					url: "/indicators/ind1-test-indicator",
				},
				{
					title: "Chapter 1",
					url: "/indicators/ind1-test-indicator/chapters/chapter-1",
				},
			]);
		});

		it("should have use chapters from first upload and convert part if there are multiple parts", () => {
			const chapterLinks = getChapterLinks({
				id: "IND1",
				title: "Test indicator",
				productType: "IND",
				summary: null,
				embedded: {
					contentPartList: {
						embedded: {
							uploadAndConvertContentPart: [
								{
									embedded: {
										htmlContent: {
											embedded: {
												htmlChapterContentInfo: [
													{
														chapterSlug: "chapter-1",
														title: "Chapter 1",
													},
													{
														chapterSlug: "chapter-2",
														title: "Chapter 2",
													},
												],
											},
										},
									},
								},
								{},
							],
						},
					},
				},
			} as ProductDetail);

			expect(chapterLinks).toStrictEqual([
				{
					title: "Chapter 1",
					url: "/indicators/ind1-test-indicator/chapters/chapter-1",
				},
				{
					title: "Chapter 2",
					url: "/indicators/ind1-test-indicator/chapters/chapter-2",
				},
			]);
		});
	});

	describe("validateRouteParams", () => {
		it("should redirect to correct overview path with incorrect slugified title", async () => {
			const result = await validateRouteParams(
				{
					slug: "ind1001-incorrect",
				},
				"/indicators/ind1001-incorrect"
			);

			expect(result).toStrictEqual({
				redirect: {
					destination: `/indicators/${slug}`,
					permanent: true,
				},
			});
		});

		it("should preserve querystring in redirect", async () => {
			const result = await validateRouteParams(
				{
					slug: "ind1001-incorrect",
				},
				"/indicators/ind1001-incorrect?somequery=true"
			);

			expect(result).toStrictEqual({
				redirect: {
					destination: `/indicators/${slug}?somequery=true`,
					permanent: true,
				},
			});
		});

		it("should redirect to correct chapter path with incorrect slugified title", async () => {
			const result = await validateRouteParams(
				{
					slug: "ind1001-incorrect",
				},
				"/indicators/ind1001-incorrect/chapters/anything?somequery=true"
			);

			expect(result).toStrictEqual({
				redirect: {
					destination: `/indicators/${slug}/chapters/anything?somequery=true`,
					permanent: true,
				},
			});
		});

		it("should redirect to correct PDF URL with incorrect slugified title", async () => {
			const result = await validateRouteParams(
				{
					slug: "ind1001-incorrect",
				},
				"/indicators/ind1001-incorrect/IND1001.pdf"
			);

			expect(result).toStrictEqual({
				redirect: {
					destination: `/indicators/${slug}/IND1001.pdf`,
					permanent: true,
				},
			});
		});
	});
});
