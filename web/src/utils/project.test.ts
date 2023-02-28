import { validateRouteParams } from "./project";

describe("project utils", () => {
	describe("validateRouteParams", () => {
		it.skip("should return not found when project is not found", async () => {
			const result = await validateRouteParams({
				slug: "abc123",
			});

			expect(result).toStrictEqual({
				notFound: true,
			});
		});
		it("should return a permanent redirect object to the published product URL when project status = 'Complete'", async () => {
			const result = await validateRouteParams({
				slug: "ind60",
			});

			expect(result).toStrictEqual({
				redirect: {
					destination: "/indicators/ind60-nxt-129-complete-test",
					permanent: true,
				},
			});
		});
	});
});
