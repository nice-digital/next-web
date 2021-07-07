import { getDefaultSeoConfig } from "./next-seo.config";

describe("Default Next SEO config", () => {
	it("should set open graph url to absolute url with given path", () => {
		expect(getDefaultSeoConfig("/test").openGraph?.url).toBe(
			"https://next-web-tests.nice.org.uk/test"
		);
	});

	it("should match snapshot", () => {
		expect(getDefaultSeoConfig("/")).toMatchSnapshot();
	});
});
