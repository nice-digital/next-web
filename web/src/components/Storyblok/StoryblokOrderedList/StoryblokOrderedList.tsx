import React from "react";

import { ListItemStoryblok, OrderedListStoryblok } from "@/types/storyblok";
import { fieldHasValidContent } from "@/utils/storyblok";

import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

export const StoryblokOrderedList: React.FC<{ blok: OrderedListStoryblok }> = ({
	blok,
}) => {
	if (!blok.listItems?.length) return null;

	const start = Number(blok.startingNumber) || 1;
	const type = blok.listType || "1";

	return (
		<div data-component="ordered-list" data-testid="ordered-list">
			<ol start={start} type={type}>
				{blok.listItems.map((item) => (
					<ListItem key={item._uid} blok={item} />
				))}
			</ol>
		</div>
	);
};

const ListItem: React.FC<{ blok: ListItemStoryblok }> = ({ blok }) => {
	return (
		<li>
			{blok.text && fieldHasValidContent(blok.text) && (
				<StoryblokRichText content={blok.text} />
			)}

			{/* render any nested ordered lists */}
			{blok.children?.map(
				(child) =>
					child.component === "orderedList" && (
						<StoryblokOrderedList key={child._uid} blok={child} />
					)
			)}
		</li>
	);
};
