import { cloneElement, ReactElement, FC } from "react";
import NextJSLink from "next/link";

export interface LinkProps {
	to: string;
	className?: string;
	children: ReactElement;
	[prop: string]: unknown;
}

/**
 * @deprecated Only here as a short term thing
 * Simple wrapper around the NextJS link component because of:
 * https://github.com/nice-digital/nice-design-system/issues/213
 */
export const Link: FC<LinkProps> = ({ children, to, className, ...attrs }) => (
	<NextJSLink href={to}>
		{cloneElement(children, { className, ...attrs })}
	</NextJSLink>
);
