/* eslint-disable import/export, import/no-unresolved -- We're deliberately overrind the default render from @testing-library with a custom render method */
import {
	render as testingLibrRender,
	RenderResult,
} from "@testing-library/react";
import { HeadManagerContext } from "next/dist/shared/lib/head-manager-context.shared-runtime";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { NextRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import { renderToString } from "react-dom/server";

import NextWebApp from "../pages/_app";

import type { AppProps } from "next/app";

/**
 *
 */
export const mockRouter: NextRouter = {
	basePath: "",
	pathname: "/",
	route: "/",
	asPath: "/",
	query: {},
	push: jest.fn(),
	replace: jest.fn(),
	reload: jest.fn(),
	back: jest.fn(),
	forward: jest.fn(),
	prefetch: jest.fn(),
	beforePopState: jest.fn(),
	events: {
		on: jest.fn(),
		off: jest.fn(),
		emit: jest.fn(),
	},
	isFallback: false,
	isLocaleDomain: false,
	isPreview: false,
	isReady: false,
};

/**
 * Convenience method for getting a mock router with the given properties.
 *
 * @example
 * 	getMockRouter({ pathname: "/about" })
 *
 * @param routerParams Optional router properties that get merged with the default mock router
 * @returns A new mock router object
 */
export const getMockRouter = (
	routerParams?: Partial<NextRouter>
): NextRouter => ({
	...mockRouter,
	...routerParams,
});

/**
 * Collect tags from next/head: https://edibleco.de/3Anu92S
 */
const HeadProvider: React.FC = ({ children }) => {
	let head: JSX.Element[];

	useEffect(() => {
		global.document.head.insertAdjacentHTML(
			"afterbegin",
			renderToString(<>{head}</>) || ""
		);
	});

	return (
		<HeadManagerContext.Provider
			value={{
				updateHead: (state) => {
					head = state;
				},
				mountedInstances: new Set(),
			}}
		>
			{children}
		</HeadManagerContext.Provider>
	);
};

export type GetWrapperOptions = {
	router: NextRouter;
	wrapper: RenderOptions["wrapper"];
};
const getAppWrapper =
	({ router, wrapper: Wrapper }: GetWrapperOptions) =>
	({ children }: { children: ReactElement }) =>
		(
			<HeadProvider>
				<RouterContext.Provider value={router}>
					<NextWebApp
						Component={() => (
							<>{Wrapper ? <Wrapper>{children}</Wrapper> : children}</>
						)}
						pageProps={{}}
						router={router as AppProps["router"]}
					/>
				</RouterContext.Provider>
			</HeadProvider>
		);

export type RenderOptions = Parameters<typeof testingLibrRender>[1] & {
	router?: Partial<NextRouter>;
};

/**
 * Custom render method the given component, wrapped in `NextWebApp` and a `HeadProvider`.
 *
 * @see https://testing-library.com/docs/react-testing-library/setup/#custom-render
 *
 * @param ui The element to render
 * @param options Optional render options that get passed to underlying React Testing Lib render method
 * @returns The render result
 */
const customRender = (
	ui: ReactElement,
	{ wrapper, router, ...options }: RenderOptions = {}
): RenderResult =>
	testingLibrRender(ui, {
		wrapper: getAppWrapper({ router: getMockRouter(router), wrapper }),
		...options,
	});

export * from "@testing-library/react";
export { customRender as render };
