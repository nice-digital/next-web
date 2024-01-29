import React, { ImgHTMLAttributes } from "react";

export interface StoryblokImageProps
	extends ImgHTMLAttributes<HTMLImageElement> {
	src: string;
	alt: string | undefined;
	className?: string;
	serviceOptions?: string;
}

export const StoryblokImage = ({
	src,
	alt,
	className,
	serviceOptions,
	...rest
}: StoryblokImageProps): React.ReactElement => {
	const placeholderSrc = "/fallback-image.png";

	const constructImageSrc = (baseUrl: string, serviceOptions?: string) => {
		return serviceOptions ? `${baseUrl}${serviceOptions}` : `${baseUrl}`;
	};

	const webpSrc = constructImageSrc(`${src}`, serviceOptions);
	const jpgSrc = constructImageSrc(`${src}`, serviceOptions);

	return (
		<picture>
			{webpSrc && <source srcSet={webpSrc} type="image/webp" />}
			<img
				className={className}
				src={jpgSrc ? jpgSrc : placeholderSrc}
				alt={alt}
				{...rest}
			/>
		</picture>
	);
};

export default StoryblokImage;
