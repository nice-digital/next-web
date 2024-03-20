import React from "react";

import { NewsListNav } from "@/components/Storyblok/News/NewsListNav/NewsListNav";

export const NewsIndexPage = (): React.ReactElement => {
	return (
		<>
			<h1>News Index Page</h1>
			<NewsListNav />
		</>
	);
};

export default NewsIndexPage;
