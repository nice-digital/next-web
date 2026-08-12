import { render } from "@testing-library/react";

import { publicRuntimeConfig } from "@/config";

import { AwsWafPreconnect } from "./AwsWafPreconnect";

jest.mock("@/config", () => ({
	publicRuntimeConfig: {
		awsWaf: {
			scriptURL: "",
		},
	},
}));

type Writable<T> = {
	-readonly [K in keyof T]: Writable<T[K]>;
};

const scriptURL =
		"https://abc123.eu-west-1.sdk.awswaf.com/abc123/nice/jsapi.js",
	mockConfig = publicRuntimeConfig as Writable<typeof publicRuntimeConfig>;

describe("AwsWafPreconnect", () => {
	describe("Integration switched off", () => {
		beforeEach(() => {
			mockConfig.awsWaf.scriptURL = "";
		});

		it("should render nothing when there is no script URL configured", () => {
			const { container } = render(<AwsWafPreconnect />);

			expect(container).toBeEmptyDOMElement();
		});
	});

	describe("Integration switched on", () => {
		/* A rel=preconnect link has no role, no text and no label, so there's nothing for a Testing
		Library query to get hold of - the container is the only way in */
		/* eslint-disable testing-library/no-container, testing-library/no-node-access */

		beforeEach(() => {
			mockConfig.awsWaf.scriptURL = scriptURL;
		});

		it("should preconnect to the origin of the configured script URL", () => {
			const { container } = render(<AwsWafPreconnect />);

			expect(container.querySelector("link")).toHaveAttribute(
				"href",
				"https://abc123.eu-west-1.sdk.awswaf.com"
			);
		});

		it("should preconnect rather than preload, as the SDK loads the script itself", () => {
			const { container } = render(<AwsWafPreconnect />);

			expect(container.querySelector("link")).toHaveAttribute(
				"rel",
				"preconnect"
			);
		});

		/* eslint-enable testing-library/no-container, testing-library/no-node-access */
	});
});
