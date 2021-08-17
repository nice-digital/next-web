/* eslint-disable testing-library/no-node-access */
import { render } from "@testing-library/react";

import { GoogleTagManager } from "./GoogleTagManager";

describe("GoogleTagManager", () => {
	it("should render GTM script", () => {
		render(<GoogleTagManager />);

		const scriptSources = Array.prototype.slice
			.call(document.scripts)
			.map((s: HTMLScriptElement) => s.src);

		// eslint-disable-next-line testing-library/no-node-access
		expect(scriptSources).toContain(
			"https://www.googletagmanager.com/gtm.js?id=GTM-M55QTQ"
		);
	});
});
