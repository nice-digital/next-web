import React, { ImgHTMLAttributes } from "react";

import { publicRuntimeConfig } from "@/config";
import {
	ImageServiceOptions,
	constructStoryblokImageSrc,
} from "@/utils/storyblok";

// extend the ImgHTMLAttributes so we can image attributes and storyblok service options
export interface StoryblokImageProps
	extends ImgHTMLAttributes<HTMLImageElement> {
	src: string | undefined;
	alt: string | undefined;
	serviceOptions?: ImageServiceOptions;
}

// We set the alt to an empty string as it's required for accessibility.
// If no alt is provided, it will be an empty string and treated as a decorative image
export const StoryblokImage = React.forwardRef<
	HTMLImageElement,
	StoryblokImageProps
>(({ src, alt = "", serviceOptions, ...rest }, ref) => {
	const placeholderSrc =
		publicRuntimeConfig.publicBaseURL + "/fallback-image.png";

	// if no src is provided, we use a placeholder image
	if (!src || src === "") {
		return <img {...rest} ref={ref} src={placeholderSrc} alt={alt} />;
	}

	if (alt.length === 0) {
		console.warn("No alt text provided for image");
		rest.role = "presentation";
	}
	// construct the source urls for webp, avif and jpeg for the picture element
	const webPSrc = constructStoryblokImageSrc(src, serviceOptions, "webp");
	const avifSrc = constructStoryblokImageSrc(src, serviceOptions, "avif");
	const jpgSrc = constructStoryblokImageSrc(src, serviceOptions, "jpeg");

	return (
		<picture>
			<source srcSet={avifSrc || src} type="image/avif" />
			<source srcSet={webPSrc || src} type="image/webp" />
			<img {...rest} ref={ref} src={jpgSrc || src} alt={alt} />
		</picture>
	);
});
