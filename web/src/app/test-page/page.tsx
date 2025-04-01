import React from "react";

import { NewsArticleStoryblok } from "@/types/storyblok";
import { initStoryblok } from "@/utils/initStoryblok";
import { fetchStory } from "@/utils/storyblok";

export const dynamic = "force-dynamic";

async function getStory(): Promise<NewsArticleStoryblok | undefined> {
	try {
		initStoryblok();
		const data = await fetchStory<NewsArticleStoryblok>("home", "published");
		const story = data?.story?.content;
		return story;
	} catch (error) {
		console.log("::: OUR ERROR :::");
		console.error(error);
		return undefined;
	}
}

export default async function TestExamplePage(): Promise<JSX.Element> {
	const storyContent = await getStory();

	return (
		<div>
			<h2>This is the test page fetching data server side</h2>
			<div>{storyContent?.component}</div>
		</div>
	);
}
