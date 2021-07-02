import "@testing-library/jest-dom/extend-expect";

// next-transpile-modules tries to look for various modules but because our tests are running in the root it looks in the wrong place.
// We don't care about them testing so we mock them. The weird 4 arrows below is a factory that returns the mock
jest.mock("next-transpile-modules", () => () => (obj: unknown) => obj);

// Mocking next/head allows us to use it in our tests to assert against meta tags/titles
// See https://edibleco.de/3dyJuUl
jest.mock("next/head", () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const ReactDOMServer = require("react-dom/server");
	return {
		__esModule: true,
		default: ({
			children,
		}: {
			children: Array<React.ReactElement> | React.ReactElement | null;
		}) => {
			if (children) {
				global.document.head.insertAdjacentHTML(
					"afterbegin",
					ReactDOMServer.renderToString(children) || ""
				);
			}
			return null;
		},
	};
});

// Make sure head is cleaned up after each test: https://edibleco.de/36dKDfL
afterEach(() => {
	// eslint-disable-next-line testing-library/no-node-access
	while (document.head.lastChild)
		// eslint-disable-next-line testing-library/no-node-access
		document.head.removeChild(document.head.lastChild);
});
