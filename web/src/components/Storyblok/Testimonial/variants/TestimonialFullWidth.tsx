import { Testimonial } from "../shared/Testimonial";
import { StoryblokImage } from "../../StoryblokImage/StoryblokImage";
import { TestimonialStoryblok } from "@/types/storyblok";

export interface TestimonialFullWidthProps {
	blok: TestimonialStoryblok;
	className?: string;
}

export const TestimonialFullWidth: React.FC<TestimonialFullWidthProps> = ({
	blok,
	className = undefined,
}) => {
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
					alt={"some alt text"}
					serviceOptions={{ height: 0, quality: 80, width: 708 }}
				/>
			}
			link={link}
		/>
	);
};
