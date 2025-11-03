import { CardGrid } from "@/components/Storyblok/CardGrid/CardGrid";
import {
	CardGridRowBasicStoryblok,
	CardGridRowCalloutStoryblok,
	CardGridRowCalloutWithImageStoryblok,
} from "@/types/storyblok";

export type CardGridRow =
	| CardGridRowBasicStoryblok
	| CardGridRowCalloutStoryblok
	| CardGridRowCalloutWithImageStoryblok;

export interface CardGridRowProps {
	blok: CardGridRow;
	pageType?: string; // Added pageType prop
}

export const CardGridRow: React.FC<CardGridRowProps> = ({
	blok,
	pageType,
}: CardGridRowProps) => {
	return (
		<>
			<CardGrid row={blok as CardGridRow} pageType={pageType} />
		</>
	);
};
