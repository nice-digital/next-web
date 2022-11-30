import { render } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { client } from "@/feeds/index";
import { FeedPath } from "@/feeds/publications/types";
import mockProduct from "@/mockData/publications/feeds/products/pmg20.json";
import mockProductTypes from "@/mockData/publications/feeds/producttypes.json";
import mockResource from "@/mockData/publications/feeds/resource/16615.json";

import ProductResourceChapterPage, {
	getServerSideProps,
} from "./[chapterSlug].page";

const axiosJSONMock = new MockAdapter(client, {
	onNoMatch: "throwException",
});

const productRoot = "process",
	slug = "pmg20",
	resourceId = "1967369",
	partId = "2549710189",
	partSlug = `developing-nice-guidelines-the-manual-appendices-${resourceId}-${partId}`,
	chapterSlug =
		"appendix-b-approaches-to-additional-consultation-and-commissioned-primary-research",
	resolvedUrl = `/${productRoot}/${slug}/${partSlug}/chapters/${chapterSlug}`,
	getServerSidePropsContext = {
		params: {
			slug,
			partSlug,
			chapterSlug,
		},
		resolvedUrl,
		query: {
			productRoot,
		},
	} as unknown as GetServerSidePropsContext<{
		slug: string;
		partSlug: string;
		chapterSlug: string;
	}>;

describe("/product/[slug]/resources/[partSlug]/chapters/[chapterSlug].page", () => {
	beforeEach(() => {
		axiosJSONMock.reset();

		axiosJSONMock
			.onGet(new RegExp(FeedPath.ProductDetail))
			.reply(200, mockProduct)
			.onGet(new RegExp(FeedPath.ProductTypes))
			.reply(200, mockProductTypes)
			.onGet(new RegExp(FeedPath.ProductTypes))
			.reply(200, mockProductTypes)
			.onGet(new RegExp("/feeds/resource/16615"))
			.reply(200, mockResource);

		(useRouter as jest.Mock).mockReturnValue({
			asPath: resolvedUrl,
		});
	});

	describe("ProductResourceChapterPage", () => {
		it("should match snapshot", async () => {
			const result = await getServerSideProps(getServerSidePropsContext);

			if ("notFound" in result || "redirect" in result) {
				throw Error(`Expected props not notFound or redirect`);
			}

			const props = await Promise.resolve(result.props),
				{ container } = render(<ProductResourceChapterPage {...props} />);

			expect(container).toMatchSnapshot();
		});
	});

	describe("getServerSideProps", () => {
		it("should return props for valid product, resource and part", async () => {
			expect(
				await getServerSideProps(getServerSidePropsContext)
			).toMatchSnapshot();
		});
	});
});
