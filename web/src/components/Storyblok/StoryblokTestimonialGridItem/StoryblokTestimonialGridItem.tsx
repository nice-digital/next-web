import { StoryblokImage } from "@/components/Storyblok/StoryblokImage/StoryblokImage";
import { Testimonial } from "@/components/Testimonial/Testimonial";
import { TestimonialGridItemStoryblok } from "@/types/storyblok";

export interface StoryblokTestimonialGridItemProps {
	blok: TestimonialGridItemStoryblok;
	className?: string;
}

export const StoryblokTestimonialGridItem: React.FC<
	StoryblokTestimonialGridItemProps
> = ({ blok }) => {
	const {
		variant,
		quoteText,
		quoteName,
		quoteRole,
		children,
		headingLevel = 4,
		image,
	} = blok;

	return (
		<Testimonial
			variant={variant === "transparent" ? "transparent" : "default"}
			quoteName={quoteName}
			quoteRole={quoteRole}
			quoteText={quoteText}
			image={
				<StoryblokImage
					src={image.filename ? image.filename : undefined}
					alt={"some alt text"}
					serviceOptions={{ height: 0, quality: 80, width: 708 }}
				/>
			}
		/>
	);
};
