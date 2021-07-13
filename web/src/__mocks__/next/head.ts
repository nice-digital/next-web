/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { FC } from "react";
import { renderToString } from "react-dom/server";

interface HeadProps {
	children: Parameters<typeof renderToString>[0];
}

/**
 * Mocking next/head allows us to use it in our tests to assert against meta tags/titles
 * See https://edibleco.de/3dyJuUl
 */
const Head: FC<HeadProps> = ({ children }: HeadProps) => {
	if (children) {
		global.document.head.insertAdjacentHTML(
			"afterbegin",
			renderToString(children) || ""
		);
	}
	return null;
};

export default Head;
