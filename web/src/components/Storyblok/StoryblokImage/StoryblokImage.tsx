import Image from "next/image";
import { ImgHTMLAttributes, forwardRef } from "react";

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
export const StoryblokImage = forwardRef<HTMLImageElement, StoryblokImageProps>(
	({ src, alt = "", serviceOptions, ...rest }, ref) => {
		const placeholderSrc =
			publicRuntimeConfig.publicBaseURL + "/fallback-image.png";

		// if no src is provided, we use a placeholder image
		if (!src || src === "") {
			return (
				<Image
					{...rest}
					ref={ref}
					src={placeholderSrc}
					alt={alt}
					width={parseInt(rest.width as string, 10)}
					height={parseInt(rest.height as string, 10)}
				/>
			);
		}

		if (alt.length === 0) {
			console.warn("No alt text provided for image");
			rest.role = "presentation";
		}
		// construct the source urls for webp, avif and jpeg for the picture element
		const webPSrc = constructStoryblokImageSrc(src, serviceOptions, "webp");
		const avifSrc = constructStoryblokImageSrc(src, serviceOptions, "avif");
		const jpgSrc = constructStoryblokImageSrc(src, serviceOptions, "jpeg");

		// Set height & width to values provided from image service with fallback as 3x2 aspect ratio as per design system Callout Card example
		// Will need updating if shape of image url changes; assumes https://a.storyblok.com/f/292509/648x349/be49eaa335/image-name.JPG/m/filters:format%28avif%29:quality%2880%29
		const widthSubstr = src.includes("/") ? src.split("/")[5].split("x")[0] : "";
		const heightSubstr = src.includes("/") ? src.split("/")[5].split("x")[1] : "";
		const dimensions = {
			width: !isNaN(parseFloat(widthSubstr)) ? widthSubstr : 600,
			height: !isNaN(parseFloat(heightSubstr)) ? heightSubstr : 400,
		};

		if (isNaN(parseFloat(widthSubstr)) || isNaN(parseFloat(heightSubstr))) {
			console.warn("Dimensions are not valid numbers");
		}

		return (
			<picture>
				<source srcSet={avifSrc || src} type="image/avif" />
				<source srcSet={webPSrc || src} type="image/webp" />
				<Image
					{...rest}
					ref={ref}
					src={jpgSrc || src}
					alt={alt}
					width={Number(dimensions.width)}
					height={Number(dimensions.height)}
				/>
			</picture>
		);
	}
);
