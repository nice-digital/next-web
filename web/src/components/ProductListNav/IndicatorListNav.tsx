import { useRouter } from "next/router";
import { stringify } from "qs";
import { FC } from "react";

import {
	HorizontalNav,
	HorizontalNavLink,
} from "@nice-digital/nds-horizontal-nav";

import { NoScrollLink } from "@/components/Link/Link";

interface NavLinkProps {
	children: string;
	href: string;
}

const NavLink: FC<NavLinkProps> = ({ children, href }) => {
	const { pathname, query } = useRouter();

	const newQuery = stringify(query, {
		addQueryPrefix: true,
		arrayFormat: "repeat",
		filter: (key, value) =>
			key === "from" || key === "to" || key === "pa" ? undefined : value,
	});

	return (
		<HorizontalNavLink
			destination={href + (pathname === href ? "" : newQuery)}
			isCurrent={pathname === href}
			elementType={NoScrollLink}
		>
			{children}
		</HorizontalNavLink>
	);
};

export const IndicatorListNav: FC = () => (
	<HorizontalNav aria-label="Stages of indicator development">
		<NavLink href="/indicators/published">Published</NavLink>
		<NavLink href="/indicators/inconsultation">In consultation</NavLink>
		<NavLink href="/indicators/indevelopment">In development</NavLink>
	</HorizontalNav>
);
