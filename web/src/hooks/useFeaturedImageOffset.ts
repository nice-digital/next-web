import debounce from "lodash/debounce";
import { useEffect, useState, RefObject } from "react";

interface StyleState {
	paddingBottom: string;
	marginTop: string;
}
export interface FeaturedImageOffsetProps {
	imageRef: RefObject<HTMLImageElement>;
	ratio: number;
	debounceDelay: number;
}

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

		const handleResize = debounce((entries: ResizeObserverEntry[]) => {
			for (const entry of entries) {
				const { height } = entry.contentRect;
				const paddingBottom = `${height / ratio}px`;
				const marginTop = `-${height / ratio + 16}px`;

				setStyles({ paddingBottom, marginTop });
			}
		}, debounceDelay);

		const observer = new ResizeObserver(handleResize);

		observer.observe(imageRef.current);

		return () => {
			observer.disconnect();
			handleResize.cancel();
		};
	}, [imageRef, ratio, debounceDelay]);

	return styles;
};
