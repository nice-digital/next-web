import { GetServerSidePropsContext } from "next";

import { getServerSideProps, productsPerPageDefault } from "../published.page";

describe("/guidance/published", () => {
	describe("getServerSideProps", () => {
		it("should return page 1 with empty pa querystring", async () => {
			const { props } = await getServerSideProps({
				query: { pa: "" },
			} as unknown as GetServerSidePropsContext);

			expect(props.currentPage).toBe(1);
		});

		it("should return page 1 with non number pa querystring", async () => {
			const { props } = await getServerSideProps({
				query: { pa: "blah" },
			} as unknown as GetServerSidePropsContext);

			expect(props.currentPage).toBe(1);
		});

		it("should return 1-based page index from pa querystring", async () => {
			const { props } = await getServerSideProps({
				query: { pa: 99 },
			} as unknown as GetServerSidePropsContext);

			expect(props.currentPage).toBe(99);
		});

		it("should return default page size with empty ps querystring", async () => {
			const { props } = await getServerSideProps({
				query: { ps: "" },
			} as unknown as GetServerSidePropsContext);

			expect(props.pageSize).toBe(productsPerPageDefault);
		});

		it("should return default page size with non number ps querystring", async () => {
			const { props } = await getServerSideProps({
				query: { ps: "blah" },
			} as unknown as GetServerSidePropsContext);

			expect(props.pageSize).toBe(productsPerPageDefault);
		});

		it("should return page size from querystring", async () => {
			const { props } = await getServerSideProps({
				query: { ps: 100 },
			} as unknown as GetServerSidePropsContext);

			expect(props.pageSize).toBe(100);
		});

		it.todo("should return number of products from given page size");

		it.todo("should exclude disabled product types");

		it.todo("should exclude disabled areas of interest");

		it.todo("should exclude withdrawn products");

		it.todo("should exclude corporate products");

		it.todo("should order by date last major modification date descending");

		it.todo(
			"should order by publised when last major modification date is the same"
		);

		it.todo(
			"should order by title alphabetically when last dates are the same"
		);
	});
});
