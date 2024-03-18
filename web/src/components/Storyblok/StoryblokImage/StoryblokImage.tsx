import React, { ImgHTMLAttributes } from "react";

// TODO: extend the ImageServiceOptions to include filters and options as and when needed?
export type ImageServiceOptions = {
	width?: number;
	height?: number;
	quality?: number;
	smart?: boolean;
};

// extend the ImgHTMLAttributes so we can image attributes and storyblok service options
export interface StoryblokImageProps
	extends ImgHTMLAttributes<HTMLImageElement> {
	src: string | undefined;
	alt: string | undefined;
	serviceOptions?: ImageServiceOptions;
}

// Construct the image src for the Storyblok image service with limited options.
// We can extend this to include more options as and when needed
export const constructStoryblokImageSrc = (
	src: string,
	serviceOptions?: ImageServiceOptions,
	format?: "webp" | "avif" | "jpeg"
): string => {
	// append /m/ to use automatic webp detection.
	// If the browser supports webp, it will use webp
	// /m/ is also required for the Storyblok image service to work.
	let url = `${src}/m/`;

	/* the width and height can be set to static {width}x{height}
	   or proportional to width or height{width}x0 or 0x{height}
	   setting width 0 and height 0 has no effect and will serve the image at it's original size*/
	if (serviceOptions?.width || serviceOptions?.height) {
		url += `${serviceOptions.width || 0}x${serviceOptions.height || 0}/`;
	}

	/* smart provides a facial detection when cropping or resizing an image
	   this is useful for bio and author images qwhen we want to focus on a face */
	if (serviceOptions?.smart) {
		url += `smart/`;
	}

	const filters = [];

	// format can be webp, avif or jpeg
	if (format) {
		filters.push(`format(${format})`);
	}

	// lets us set the quality of the image for optimisation
	if (serviceOptions?.quality) {
		filters.push(`quality(${serviceOptions.quality})`);
	}

	// if filters are set, add them to the url and separate them with a colon which is required
	if (filters.length) {
		url += `filters:${filters.join(":")}/`;
	}

	return url;
};

//TODO: do we pass a fallback image as a prop or just use a default fallback image?
// We set the alt to an empty string as it's required for accessibility.
// If no alt is provided, it will be an empty string and treated as a decorative image
export const StoryblokImage = React.forwardRef<
	HTMLImageElement,
	StoryblokImageProps
>(({ src, alt = "", serviceOptions, ...rest }, ref) => {
	const placeholderSrc = "/fallback-image.png";

	// if no src is provided, use a placeholder image.  See TODO above
	if (!src || src === "") {
		return <img {...rest} ref={ref} src={placeholderSrc} alt={alt} />;
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
