import React from "react";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";
import { ListItemStoryblok, OrderedListStoryblok } from "@/types/storyblok";

export const StoryblokOrderedList: React.FC<{ blok: OrderedListStoryblok }> = ({
	blok,
}) => {
	const { startingNumber, listType, listItems } = blok;

	const start = Number(startingNumber) || 1;
	const type = listType || "1";

	if (!listItems?.length) return null;

	return (
		<div data-component="ordered-list" data-testid="ordered-list">
			<ol start={start} type={type}>
				{listItems.map((item) => (
					<ListItem key={item._uid} blok={item} />
				))}
			</ol>
		</div>
	);
};

const ListItem: React.FC<{ blok: ListItemStoryblok }> = ({ blok }) => {
	const { text, children } = blok;

	return (
		<li>
			<StoryblokRichText content={text ?? { type: "doc", content: [] }} />
			{Array.isArray(children) && children.length > 0 && (
				<StoryblokOrderedList blok={children[0]} />
			)}
		</li>
	);
};
