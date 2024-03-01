import debounce from "lodash/debounce";
import { useEffect, useState, useRef, RefObject } from "react";

// import { useResize } from "./useResize";

interface StyleState {
	paddingBottom: string;
	marginTop: string;
}
export interface FeaturedImageOffsetProps {
	imageRef: RefObject<HTMLImageElement>;
	ratio: number;
	debounceDelay: number;
}

/**
 * Work around for PageHeader with overlapping FeaturedImage to shared across news and blog post pages
 * Currently still needing to add a CSS var to the parent article which we can then target the pageHeader padding with
 * TODO: Update the PageHeader in the DS with forwardRef so we can target the element directly.
 * Remove the cssVariable once PageHeader carries a forwardRef
 */
export const useFeaturedImageOffset = ({
	imageRef,
	ratio = 1.75,
	debounceDelay = 250,
}: FeaturedImageOffsetProps): StyleState => {
	const [styles, setStyles] = useState<StyleState>({
		paddingBottom: "0px",
		marginTop: "0px",
	});

	useEffect(() => {
		if (!imageRef.current) return;

		const resizeCallback = (entry: ResizeObserverEntry) => {
			const { height } = entry.contentRect;
			const paddingBottom = `${height / ratio}px`;
			const marginTop = `-${height / ratio + 16}px`;

			setStyles({ paddingBottom, marginTop });
		};

		const observer = new ResizeObserver(
			debounce((entries) => {
				console.log("resizeObserver");
				for (const entry of entries) {
					resizeCallback(entry);
				}
			}, debounceDelay)
		);

		observer.observe(imageRef.current);

		return () => {
			observer.disconnect();
		};
	}, [imageRef, ratio, debounceDelay]);

	return styles;
	// useResize({
	// 	callback: () => {
	// 		if (topOverlapElement.current && imageRef.current) {
	// 			const offset = Math.floor(imageRef.current.height / ratio);
	// 			imageRef.current.style.marginTop = `calc(calc(${offset}px * -1) - 1rem)`;
	// 			// topOverlapElement.current.style.paddingBottom = `${offset}px`;
	// 			topOverlapElement.current.style.setProperty(cssVariable, `${offset}px`);
	// 		}
	// 	},
	// 	debounceDelay,
	// });
};
