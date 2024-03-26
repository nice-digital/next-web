import React, { ImgHTMLAttributes } from "react";

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

	const constructImageSrc = (baseUrl: string, serviceOptions?: string) => {
		return serviceOptions ? `${baseUrl}${serviceOptions}` : `${baseUrl}`;
	};

	if (!src) {
		src = placeholderSrc;
		rest["data-testid"] = "storyblok-image-fallback";
	}

	const webpSrc = constructImageSrc(`${src}/m/`, serviceOptions);
	const jpgSrc = constructImageSrc(`${src}/`, serviceOptions);

	return (
		<picture>
			{webpSrc && <source srcSet={webpSrc} type="image/webp" />}
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
