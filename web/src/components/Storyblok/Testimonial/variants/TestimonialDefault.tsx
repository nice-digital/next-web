import { Testimonial } from "../shared/Testimonial";
import { StoryblokImage } from "../../StoryblokImage/StoryblokImage";
import { TestimonialDefaultStoryblok } from "@/types/storyblok";

export interface TestimonialDefaultProps {
	blok: TestimonialDefaultStoryblok;
	className?: string;
}

export const TestimonialDefault: React.FC<TestimonialDefaultProps> = ({ blok }) => {
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
