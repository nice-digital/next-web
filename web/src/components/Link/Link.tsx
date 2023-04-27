import NextJSLink, { LinkProps as NextJSLinkProps } from "next/link";
import { useRouter } from "next/router";
import { FC, ReactChild, useEffect, useCallback } from "react";
import { RequireExactlyOne, SetOptional, Except } from "type-fest";

type NextJSUrl = NextJSLinkProps["href"];
export type LinkProps = RequireExactlyOne<
	{
		to?: NextJSUrl;
		className?: string;
		children: ReactChild;
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
}) => {
	if (!children) throw Error("Expected Link to have children");

	return (
		<NextJSLink
			href={(to || href) as NextJSUrl}
			as={as}
			replace={replace}
			scroll={scroll}
			shallow={shallow}
			passHref={passHref}
			locale={locale}
			className={className}
			{...attrs}
		>
			{children}
		</NextJSLink>
	);
};

export const NoScrollLink: FC<LinkProps & { scroll?: never }> = (props) => (
	<Link {...props} scroll={false} />
);

export const ScrollToLink: FC<
	LinkProps & { scrollTargetId: string; onClick?: never; scroll?: never }
> = ({ scrollTargetId, ...props }) => {
	const router = useRouter();

	const handleRouteChange = useCallback(() => {
		const targetElement = document.getElementById(scrollTargetId);
		if (targetElement) {
			targetElement.setAttribute("tabIndex", "-1");
			targetElement.focus();
			targetElement.scrollIntoView();
		} else {
			console.warn(`Element with id ${scrollTargetId} could not be found`);
		}
		router.events.off("routeChangeComplete", handleRouteChange);
	}, [router.events, scrollTargetId]);

	useEffect(() => {
		if (router.events)
			router.events.on("routeChangeComplete", handleRouteChange);

		return () => {
			if (router.events)
				router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events, handleRouteChange]);

	return (
		<Link
			{...props}
			scroll={false}
			onClick={() => {
				router.events.on("routeChangeComplete", handleRouteChange);
			}}
		/>
	);
};
