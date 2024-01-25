import React from "react";

export interface StoryblokImageProps {
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
}: StoryblokImageProps): React.ReactElement => {
	// console.log("StoryblokImage blok", blok);
	const constructImageSrc = (baseUrl: string, serviceOptions?: string) => {
		return serviceOptions ? `${baseUrl}/${serviceOptions}/` : `${baseUrl}/`;
	};

	const webpSrc = constructImageSrc(`${src}/m`, serviceOptions);
	const jpgSrc = constructImageSrc(`${src}`, serviceOptions);
	console.log(webpSrc, jpgSrc);
	return (
		<picture>
			<source srcSet={webpSrc} type="image/webp" />
			<img className={className} src={jpgSrc} alt={alt} />
		</picture>
	);
};

export default StoryblokImage;
