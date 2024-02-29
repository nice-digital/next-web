import { RefObject } from "react";

import { useResize } from "./useResize";

export interface FeaturedImageOffsetProps {
	cssVariable: string;
	debounceDelay: number;
	imageRef: RefObject<HTMLImageElement>;
	topOverlapElement: RefObject<HTMLElement>;
	ratio: number;
}

/**
 * Work around for PageHeader with overlapping FeaturedImage to shared across news and blog post pages
 * Currently still needing to add a CSS var to the parent article which we can then target the pageHeader padding with
 * TODO: Update the PageHeader in the DS with forwardRef so we can target the element directly.
 * Remove the cssVariable once PageHeader carries a forwardRef
 */
export const useFeaturedImageOffset = ({
	cssVariable = "--featuredImageOffset",
	debounceDelay = 250,
	imageRef,
	topOverlapElement,
	ratio = 1.75,
}: FeaturedImageOffsetProps): void => {
	useResize({
		callback: () => {
			if (topOverlapElement.current && imageRef.current) {
				const offset = Math.floor(imageRef.current.height / ratio);

				imageRef.current.style.marginTop = `calc(calc(${offset}px * -1) - 1rem)`;
				// topOverlapElement.current.style.paddingBottom = `${offset}px`;
				topOverlapElement.current.style.setProperty(cssVariable, `${offset}px`);
			}
		},
		debounceDelay,
	});
};
