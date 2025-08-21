import Image from "next/image";
import { ImgHTMLAttributes, forwardRef } from "react";

import { publicRuntimeConfig } from "@/config";
import {
	ImageServiceOptions,
	constructStoryblokImageSrc,
} from "@/utils/storyblok";

// extend the ImgHTMLAttributes so we can image attributes and storyblok service options
export interface StoryblokImageProps
	extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
	src: string | null | undefined;
	alt?: string | null | undefined;
	serviceOptions?: ImageServiceOptions;
}

// We set the alt to an empty string as it's required for accessibility.
// If no alt is provided, it will be an empty string and treated as a decorative image
export const StoryblokImage = forwardRef<HTMLImageElement, StoryblokImageProps>(
	({ src, alt, serviceOptions, ...rest }, ref) => {
		const placeholderSrc =
			publicRuntimeConfig.publicBaseURL + "/fallback-image.png";

		// Convert null values to empty strings for proper typing
		const normalisedAlt = alt ?? "";
		const normalisedSrc = src ?? "";

		// if no src is provided, we use a placeholder image
		if (!normalisedSrc || normalisedSrc === "") {
			return (
				<Image
					{...rest}
					ref={ref}
					src={placeholderSrc}
					alt={normalisedAlt}
					layout="intrinsic"
					width={rest.width ? parseInt(rest.width as string, 10) : 0}
					height={rest.height ? parseInt(rest.height as string, 10) : 0}
				/>
			);
		}

		if (normalisedAlt.length === 0) {
			console.warn("No alt text provided for image");
			rest.role = "presentation";
		}
		// construct the source urls for webp, avif and jpeg for the picture element
		const webPSrc = constructStoryblokImageSrc(
			normalisedSrc,
			serviceOptions,
			"webp"
		);
		const avifSrc = constructStoryblokImageSrc(
			normalisedSrc,
			serviceOptions,
			"avif"
		);
		const jpgSrc = constructStoryblokImageSrc(
			normalisedSrc,
			serviceOptions,
			"jpeg"
		);

		// Set height & width to values provided from image service with fallback as square image at ~full size mobile resolution
		// Will need updating if shape of image url changes; assumes https://a.storyblok.com/f/292509/648x349/be49eaa335/image-name.JPG/m/filters:format%28avif%29:quality%2880%29
		const widthSubstr = normalisedSrc.match(
			/^https:\/\/a\.storyblok\.com\/f\/\d+\/\d{2,5}x\d{2,5}/gm
		)
			? normalisedSrc.split("/")[5].split("x")[0]
			: "";
		const heightSubstr = normalisedSrc.match(
			/^https:\/\/a\.storyblok\.com\/f\/\d+\/\d{2,5}x\d{2,5}/gm
		)
			? normalisedSrc.split("/")[5].split("x")[1]
			: "";
		const dimensions = {
			width: !isNaN(parseFloat(widthSubstr)) ? widthSubstr : 600,
			height: !isNaN(parseFloat(heightSubstr)) ? heightSubstr : 600,
		};

		if (
			isNaN(parseFloat(widthSubstr)) ||
			isNaN(parseFloat(heightSubstr)) ||
			dimensions.width === 0 ||
			dimensions.height === 0
		) {
			console.warn("Dimensions are not valid numbers");
			// TODO: Sense check / update components using StoryblokImage to make correct use of serviceOptions
		}

		return (
			<picture>
				<source srcSet={avifSrc || normalisedSrc} type="image/avif" />
				<source srcSet={webPSrc || normalisedSrc} type="image/webp" />
				<Image
					{...rest}
					ref={ref}
					src={jpgSrc || normalisedSrc}
					alt={normalisedAlt}
					layout="intrinsic"
					width={
						typeof serviceOptions?.width == "number"
							? Number(serviceOptions.width)
							: Number(dimensions.width)
					}
					height={
						typeof serviceOptions?.height == "number"
							? Number(serviceOptions.height)
							: Number(dimensions.height)
					}
				/>
			</picture>
		);
	}
);
