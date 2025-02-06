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
	const {
		variant,
		quoteText,
		quoteName,
		quoteRole,
		children,
		headingLevel = 4,
		image,
		link,
	} = blok;

	return (
		<Testimonial
			variant={variant === "fullWidthWhite" ? "fullWidthWhite" : "fullWidth"}
			quoteName={quoteName}
			quoteRole={quoteRole}
			quoteText={quoteText}
			className={className}
			image={
				<StoryblokImage
					src={image.filename ? image.filename : undefined}
					alt={image.alt ? image.alt : ""}
					serviceOptions={{ height: 0, quality: 80, width: 708 }}
				/>
			}
			link={
				link && link.length > 0 ? <StoryblokRelatedLink blok={link[0]} /> : null
			}
		/>
	);
};
