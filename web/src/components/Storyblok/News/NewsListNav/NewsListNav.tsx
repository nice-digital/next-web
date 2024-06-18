import { useRouter } from "next/router";
import React, { useState, useEffect, useCallback, useMemo } from "react";

import {
	HorizontalNav,
	HorizontalNavLink,
} from "@nice-digital/nds-horizontal-nav";

import { NoScrollLink } from "@/components/Link/Link";

type Destination = {
	url: string;
	title: string;
};

export const NewsListNav = (): React.ReactElement => {
	const router = useRouter();
	const [activeLink, setActiveLink] = useState<Destination>();

	const destinations = useMemo(
		() => [
			{ url: "/news", title: "News" },
			{ url: "/news/articles", title: "News articles" },
			{ url: "/news/in-depth", title: "In-depth" },
			{ url: "/news/blogs", title: "Blogs" },
			{ url: "/news/podcasts", title: "Podcasts" },
		],
		[]
	);

	const getActiveLink = useCallback(
		(pathname: string): Destination | undefined => {
			const baseURL = pathname.split("?")[0]; // Extract base URL without query string
			return destinations.find((link) => baseURL === link.url);
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
