import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback } from "react";

import {
	HorizontalNav,
	HorizontalNavLink,
} from "@nice-digital/nds-horizontal-nav";

import { NoScrollLink } from "@/components/Link/Link";

type Destination = {
	url: string;
	title: string;
};

type DestinationProps = {
	destinations: Destination[];
};

export const NewsListNav = ({
	destinations,
}: DestinationProps): React.ReactElement => {
	const router = useRouter();
	const [activeLink, setActiveLink] = useState<Destination>();

	const getActiveLink = useCallback(
		(pathname: string): Destination | undefined => {
			return destinations.find((link) => pathname === link.url);
		},
		[destinations]
	);

	useEffect(() => {
		setActiveLink(getActiveLink(router.pathname));

		const handleRouteChange = (url: string) => {
			setActiveLink(getActiveLink(url));
		};

		router.events.on("routeChangeComplete", handleRouteChange);

		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [getActiveLink, router]);

	const handleLinkClick = (destination: string) => {
		setActiveLink(getActiveLink(destination));
		router.push({
			pathname: destination,
		});
	};

	return (
		<HorizontalNav aria-label="News section navigation">
			{destinations.map((link, index) => (
				<HorizontalNavLink
					key={index}
					destination={link.url}
					isCurrent={activeLink && activeLink.url === link.url}
					onClick={() => handleLinkClick(link.url)}
					elementType={NoScrollLink}
				>
					{link.title}
				</HorizontalNavLink>
			))}
		</HorizontalNav>
	);
};
