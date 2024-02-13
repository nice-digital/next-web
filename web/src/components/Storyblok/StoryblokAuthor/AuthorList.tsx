import { StoryblokComponent } from "@storyblok/react";
import React from "react";
import { StoryblokStory } from "storyblok-generate-ts";

import { AuthorStoryblok } from "@/types/storyblok";

export const AuthorList = ({
	authors,
}: {
	authors: StoryblokStory<AuthorStoryblok>[] | null;
}): React.ReactElement | null => {
	if (!authors) {
		return null;
	}

	if (authors.length === 1) {
		return <StoryblokComponent blok={authors[0].content} />;
	} else {
		return (
			<div>
				{authors.map((author) => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { image, ...contentWithoutImage } = author.content;
					return (
						<StoryblokComponent
							key={contentWithoutImage._uid}
							blok={contentWithoutImage}
						/>
					);
				})}
			</div>
		);
	}
};
