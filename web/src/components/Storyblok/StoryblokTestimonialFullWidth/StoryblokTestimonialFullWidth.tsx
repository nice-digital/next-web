import { TestimonialFullWidthStoryblok } from "@/types/storyblok";

import { Testimonial } from "../../Testimonial/Testimonial";
import { StoryblokImage } from "../StoryblokImage/StoryblokImage";
import { StoryblokRelatedLink } from "../StoryblokRelatedLink/StoryblokRelatedLink";

export interface StoryblokTestimonialFullWidthProps {
	blok: TestimonialFullWidthStoryblok;
	className?: string;
}

export const StoryblokTestimonialFullWidth: React.FC<
	StoryblokTestimonialFullWidthProps
> = ({ blok, className = undefined }) => {
	const { variant, quoteText, quoteName, quoteRole, image, link } = blok;

	return (
		<Testimonial
			variant={variant === "fullWidthWhite" ? "fullWidthWhite" : "fullWidth"}
			quoteName={quoteName}
			quoteRole={quoteRole}
			quoteText={quoteText}
			className={className}
			image={
				<StoryblokImage
					src={image?.filename ? image.filename : undefined}
					alt={image?.alt ? image.alt : ""}
					serviceOptions={{ height: 440, quality: 80, width: 440 }}
				/>
			}
			link={
				link && link.length > 0 ? <StoryblokRelatedLink blok={link[0]} /> : null
			}
		/>
	);
};
