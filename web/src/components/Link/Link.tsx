import NextJSLink, { LinkProps as NextJSLinkProps } from "next/link";
import { cloneElement, ReactElement, FC } from "react";
import { RequireExactlyOne, SetOptional, Except } from "type-fest";

type NextJSUrl = NextJSLinkProps["href"];

export type LinkProps = RequireExactlyOne<
	{
		to?: NextJSUrl;
		className?: string;
		children: string | ReactElement;
	} & SetOptional<Except<NextJSLinkProps, "prefetch">, "href">,
	// Support either using `href` or `to` because of different prop types for NDS components vs other.
	"href" | "to"
> & {
	[prop: string]: unknown;
};

/**
 * Simple wrapper around the NextJS link component to allow us pass classes etc directly to the parent wrapper.
 *
 * The className prop and any other attributes are passed to the child anchor element.
 */
export const Link: FC<LinkProps> = ({
	// NextJS link props
	href,
	as,
	replace,
	scroll,
	shallow,
	passHref,
	locale,
	// 'Normal' link props
	to,
	children,
	className,
	...attrs
}) => (
	<NextJSLink
		href={(to || href) as NextJSUrl}
		as={as}
		replace={replace}
		scroll={scroll}
		shallow={shallow}
		passHref={passHref}
		locale={locale}
	>
		{typeof children === "string"
			? children
			: cloneElement(children, { className, ...attrs })}
	</NextJSLink>
);
