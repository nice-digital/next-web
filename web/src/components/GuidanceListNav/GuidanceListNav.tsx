import { useRouter } from "next/router";
import { FC } from "react";

import {
	HorizontalNav,
	HorizontalNavLink,
} from "@nice-digital/nds-horizontal-nav";
import { Link } from "@/components/Link/Link";

export const GuidanceListNav: FC = () => {
	const { pathname } = useRouter();

	return (
		<HorizontalNav aria-label="Stages of guidance development">
			<HorizontalNavLink
				destination="/guidance/published"
				isCurrent={pathname === "/guidance/published"}
				elementType={Link}
			>
				<a>Published</a>
			</HorizontalNavLink>
			<HorizontalNavLink
				destination="/guidance/inconsultation"
				isCurrent={pathname === "/guidance/inconsultation"}
				elementType={Link}
			>
				<a>In consultation</a>
			</HorizontalNavLink>
			<HorizontalNavLink
				destination="/guidance/indevelopment"
				isCurrent={pathname === "/guidance/indevelopment"}
				elementType={Link}
			>
				<a>In development</a>
			</HorizontalNavLink>
			<HorizontalNavLink
				destination="/guidance/proposed"
				isCurrent={pathname === "/guidance/proposed"}
				elementType={Link}
			>
				<a>Proposed</a>
			</HorizontalNavLink>
		</HorizontalNav>
	);
};
