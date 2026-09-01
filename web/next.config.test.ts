import nextConfig from "./next.config";

describe("next.config.js", () => {
	it("should disable x-powered-by header", () => {
		expect(nextConfig.poweredByHeader).toBe(false);
	});

	it("should add security headers to all pages", async () => {
		if (!nextConfig.headers) return expect(nextConfig.headers).toBeTruthy();

		const headers = await nextConfig.headers(),
			globalHeader = headers.find((h) => h.source === "/(.*)");

		expect(globalHeader?.headers).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "key": "Cache-Control",
		    "value": "public, s-maxage=900, max-age=480, stale-while-revalidate=1800",
		  },
		  Object {
		    "key": "X-App",
		    "value": "next-web",
		  },
		  Object {
		    "key": "X-DNS-Prefetch-Control",
		    "value": "on",
		  },
		  Object {
		    "key": "Strict-Transport-Security",
		    "value": "max-age=31536000; includeSubDomains; preload",
		  },
		  Object {
		    "key": "X-XSS-Protection",
		    "value": "1; mode=block",
		  },
		  Object {
		    "key": "Permissions-Policy",
		    "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
		  },
		  Object {
		    "key": "X-Content-Type-Options",
		    "value": "nosniff",
		  },
		  Object {
		    "key": "Referrer-Policy",
		    "value": "strict-origin-when-cross-origin",
		  },
		  Object {
		    "key": "Content-Security-Policy",
		    "value": "frame-ancestors 'self' https://app.storyblok.com",
		  },
		  Object {
		    "key": "Link",
		    "value": "<https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js>; rel=preload; as=script,<https://apikeys.civiccomputing.com>; rel=preconnect; crossorigin,<https://www.googletagmanager.com>; rel=preconnect",
		  },
		]
	`);
	});

	describe("Redirects", () => {
		it("should redirect proposed list page to awaiting development list page", async () => {
			if (!nextConfig.redirects)
				return expect(nextConfig.redirects).toBeTruthy();

			const redirects = await nextConfig.redirects(),
				proposedListPageRedirect = redirects.find(
					(r) => r.source === "/guidance/proposed"
				);

			expect(proposedListPageRedirect).toHaveProperty(
				"destination",
				"/guidance/awaiting-development"
			);
			expect(proposedListPageRedirect).toHaveProperty("permanent", true);
		});
	});
});
