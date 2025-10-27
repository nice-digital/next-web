import React from "react";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";
import { ListItemStoryblok, OrderedListStoryblok } from "@/types/storyblok";

export const StoryblokOrderedList: React.FC<OrderedListStoryblok> = ({
	blok
}) => {
	const start = Number(blok.startingNumber) || 1;
	const type = blok.listType || "1";
	return (
		<ol start={start} type={type}>
			{blok.listItems?.map((item: ListItemStoryblok) => (
				<ListItem blok={item} />
			))}
		</ol>
	);
};

export const ListItem = ({ blok }: { blok: ListItemStoryblok }) => {
	return (
		<li>
			<StoryblokRichText content={blok.text ?? { type: "doc", content: [] }} />
			{blok?.children?.length && blok.children.length > 0 && (
				<StoryblokOrderedList blok={blok.children[0]} component={"orderedList"} _uid={""} />
			)}
		</li>
	);
};
