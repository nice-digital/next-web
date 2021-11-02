import NextJSLink, { LinkProps as NextJSLinkProps } from "next/link";
import { useRouter } from "next/router";
import { cloneElement, FC, Children, ReactElement, useEffect } from "react";
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
		{typeof children === "string" ||
		typeof children === "number" ||
		Children.count(children) > 1 ? (
			<a className={className} {...attrs}>
				{children}
			</a>
		) : (
			cloneElement(children, { className, ...attrs })
		)}
	</NextJSLink>
);

export const NoScrollLink: FC<LinkProps & { scroll?: never }> = (props) => (
	<Link {...props} scroll={false} />
);

export const ScrollToLink: FC<
	LinkProps & { scrollTargetId: string; onClick?: never; scroll?: never }
> = ({ scrollTargetId, ...props }) => {
	const router = useRouter();
	const handleRouteChange = () => {
		return false;
	};
	useEffect(() => {
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events]);
	return (
		<Link
			{...props}
			scroll={false}
			onClick={() => {
				const targetElement = document.getElementById(scrollTargetId);
				router.events.on("routeChangeComplete", () => {
					if (targetElement) {
						targetElement.setAttribute("tabIndex", "-1");
						targetElement.focus();
						targetElement.scrollIntoView();
					} else {
						console.warn(
							`Element with id ${scrollTargetId} could not be found`
						);
					}
				});
			}}
		/>
	);
};
