import { GetServerSidePropsContext } from "next";

import { getServerSideProps } from "./[slug].page";

describe("getServerSideProps", () => {
	it("should return 404 when no mapping found", async () => {
		await expect(
			getServerSideProps({
				resolvedUrl:
					"/standards-and-indicators/ccgoisindicators/does-not-exist",
			} as unknown as GetServerSidePropsContext)
		).resolves.toStrictEqual({
			notFound: true,
		});
	});

	it("should return 404 when mapping exists but product not found", async () => {
		await expect(
			getServerSideProps({
				resolvedUrl:
					"/standards-and-indicators/ccgoisindicators/product-not-found",
			} as unknown as GetServerSidePropsContext)
		).resolves.toStrictEqual({
			notFound: true,
		});
	});

	it("should return redirect to new product URL when mapping and product exist", async () => {
		await expect(
			getServerSideProps({
				resolvedUrl:
					"/standards-and-indicators/qofindicators/the-percentage-of-patients-with-diabetes-with-a-record-of-testing-of-foot-sensation-using-a-10g-monofilament-within-the-preceding-12-months",
			} as unknown as GetServerSidePropsContext)
		).resolves.toStrictEqual({
			redirect: {
				permanent: true,
				destination:
					"/indicators/ind102-the-contractor-establishes-and-maintains-a-register-of-all-patients-on-the-autistic-spectrum",
			},
		});
	});
});
