import React from "react";

import { NewsListNav } from "@/components/Storyblok/News/NewsListNav/NewsListNav";

export const NewsIndexPage = (): React.ReactElement => {
	const destinations = [
		{ url: "/news", title: "News" },
		{ url: "/news/articles", title: "News articles" },
		{ url: "/news/in-depth", title: "In-depth" },
		{ url: "/news/blogs", title: "Blogs" },
		{ url: "/news/podcasts", title: "Podcasts" },
	];
	return (
		<>
			<h1>News Index Page</h1>
			<NewsListNav destinations={destinations} />
		</>
	);
};

export default NewsIndexPage;
