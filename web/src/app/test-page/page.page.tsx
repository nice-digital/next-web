
import { NewsArticleStoryblok } from "@/types/storyblok";
import { initStoryblok } from "@/utils/initStoryblok";
import { fetchStory } from "@/utils/storyblok";

import React from "react";

 async function getStory(): Promise<NewsArticleStoryblok | undefined> {
	try {
		initStoryblok();
		const data = await fetchStory<NewsArticleStoryblok>('news/articles/annual-bmi-checks-recommended-for-adults-with-long-term-conditions', 'published');
		const story = data?.story?.content;
		return story;
	} catch (error) {
		console.log('::: OUR ERROR :::')
		console.error(error);
		return undefined;
	}
}


export default async function TestExamplePage(): Promise<JSX.Element> {

	const storyContent = await getStory();

	return (
		<div>
			<h2>This is the test page fetching data server side</h2>
			<div>
				{storyContent?.component}
			</div>
		</div>
	);
}

