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
		    "key": "X-DNS-Prefetch-Control",
		    "value": "on",
		  },
		  Object {
		    "key": "Strict-Transport-Security",
		    "value": "max-age=31536000; includeSubDomains; preload",
		  },
		  Object {
		    "key": "X-Frame-Options",
		    "value": "DENY",
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
		    "value": "frame-ancestors 'none'",
		  },
		  Object {
		    "key": "Link",
		    "value": "<https://cdn.nice.org.uk/cookie-banner/cookie-banner.min.js>; rel=preload; as=script,<https://apikeys.civiccomputing.com>; rel=preconnect; crossorigin,<https://www.googletagmanager.com>; rel=preconnect,<https://fonts.googleapis.com>; rel=preconnect,<https://fonts.gstatic.com>; rel=preconnect; crossorigin",
		  },
		]
	`);
	});
});
