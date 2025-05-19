import {
	CardGridRowBasicStoryblok,
	CardGridRowCalloutStoryblok,
	CardGridRowCalloutWithImageStoryblok,
} from "@/types/storyblok";

import { CardGrid } from "@/components/Storyblok/CardGrid/CardGrid";

export type CardGridRow =
	| CardGridRowBasicStoryblok
	| CardGridRowCalloutStoryblok
	| CardGridRowCalloutWithImageStoryblok;

export interface CardGridRowProps {
	blok: CardGridRow;
}

export const CardGridRow: React.FC<CardGridRowProps> = ({
	blok,
}: CardGridRowProps) => {
	return (
		<>
			<CardGrid row={blok as CardGridRow} />
		</>
	);
};
