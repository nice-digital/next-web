import { useRouter } from "next/router";
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
	const { pathname } = useRouter();

	return (
		<HorizontalNavLink
			destination={href}
			isCurrent={pathname === href}
			elementType={NoScrollLink}
		>
			{children}
		</HorizontalNavLink>
	);
};

export const GuidanceListNav: FC = () => (
	<HorizontalNav aria-label="Stages of guidance development">
		<NavLink href="/guidance/published">Published</NavLink>
		<NavLink href="/guidance/inconsultation">In consultation</NavLink>
		<NavLink href="/guidance/indevelopment">In development</NavLink>
		<NavLink href="/guidance/proposed">Proposed</NavLink>
	</HorizontalNav>
);
