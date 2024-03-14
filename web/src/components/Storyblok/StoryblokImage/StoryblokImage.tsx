import React, { ImgHTMLAttributes, use } from "react";

export interface StoryblokImageProps
	extends ImgHTMLAttributes<HTMLImageElement> {
	src: string | undefined;
	alt: string | undefined;
	className?: string;
	serviceOptions?: string;
	[key: `data-${string}`]: string;
}

export const StoryblokImage = React.forwardRef<
	HTMLImageElement,
	StoryblokImageProps
>(({ src, alt, className, serviceOptions, ...rest }, ref) => {
	const placeholderSrc = "/fallback-image.png";

	if (!src || src === "") {
		// console.error("src is empty");
		// src = placeholderSrc;
		// rest["data-testid"] = "storyblok-image-fallback";
		return;
	}

	function removeLeadingSlashes(str: string): string {
		return str.replace(/^\/+/, "");
	}

	const constructImageSrc = (
		baseUrl: string,
		serviceOptions?: string,
		useWebP?: boolean
	) => {
		if (serviceOptions && serviceOptions?.startsWith("/")) {
			serviceOptions = removeLeadingSlashes(serviceOptions);
		}

		if (useWebP && serviceOptions) {
			return `${baseUrl}/m/${serviceOptions}`;
		} else if (useWebP) {
			return `${baseUrl}/m/`;
		} else {
			return serviceOptions ? `${baseUrl}/${serviceOptions}` : `${baseUrl}`;
		}
	};

	const webpSrc = constructImageSrc(`${src}`, serviceOptions, true);
	const jpgSrc = constructImageSrc(`${src}`, serviceOptions);

	return (
		<picture>
			<source srcSet={webpSrc} type="image/webp" />
			<source srcSet={jpgSrc} type="image/jpeg" />
			<img
				ref={ref}
				className={className}
				src={jpgSrc ? jpgSrc : placeholderSrc}
				alt={alt}
				{...rest}
			/>
		</picture>
	);
});

export default StoryblokImage;
