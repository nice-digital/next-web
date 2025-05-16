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
	const { variant, quoteText, quoteName, quoteRole, image } = blok;

	return (
		<Testimonial
			variant={variant === "transparent" ? "transparent" : "default"}
			quoteName={quoteName}
			quoteRole={quoteRole}
			quoteText={quoteText}
			image={
				image?.filename ? (
					<StoryblokImage
						src={image.filename}
						alt={image?.alt ? image.alt : ""}
						serviceOptions={{ height: 328, quality: 80, width: 328 }}
					/>
				) : undefined
			}
		/>
	);
};
