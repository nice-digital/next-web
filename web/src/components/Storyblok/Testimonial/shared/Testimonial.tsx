import React, {
	ReactElement,
	ReactNode,
	isValidElement,
	cloneElement,
} from "react";
import classnames from "classnames";
import styles from "./Testimonial.module.scss";
import { Link } from "@/components/Link/Link";

export interface TestimonialProps {
	variant?: "default" | "transparent" | "fullWidth" | "fullWidthWhite";
	children?: ReactNode[] | ReactNode; //TODO does this component need to be able to accept children?
	className?: string;
	image?: ReactElement;
	quoteText: string;
	quoteName: string;
	quoteRole: string;
	headingLevel?: 2 | 3 | 4 | 5 | 6;
	link?: any;//TODO Need to add proper types to link
}

export const Testimonial: React.FC<TestimonialProps> = (
	props
): JSX.Element | null => {
	const {
		variant = "default",
		quoteText,
		quoteName,
		quoteRole,
		children,
		className,
		headingLevel = 4,
		link=undefined,
		image,
		...rest
	} = props;

	const kebabCaseVariantClassName = variant
		? `${variant.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}`
		: "";

	const testimonialClasses = classnames(
		styles.testimonial,
		{
			[styles[`testimonial--${kebabCaseVariantClassName}`]]: variant,
		},
		className
	);

	const mobileImage = isValidElement(image)
		? cloneElement(image as ReactElement, {
				className: classnames(
					(image as ReactElement).props.className,
					styles.testimonial__image,
					styles.testimonial__imageMobile
				),
				alt: (image as ReactElement).props.alt || "Testimonial Mobile Image",
		  })
		: null;
	const mainImage = isValidElement(image)
		? cloneElement(image as ReactElement, {
				className: classnames(
					(image as ReactElement).props.className,
					styles.testimonial__image
				),
				alt: (image as ReactElement).props.alt || "Testimonial Main Image",
		  })
		: null;
	return (
		<div
			className={testimonialClasses}
			data-component={`testimonial${variant ? `--${variant}` : ""}`}
			data-testid={`testimonial-${variant}`}
			{...rest}
		>
			<div className={styles.testimonialMainContent}>
				<div className={styles.testimonial__mainImageContainer}>
					{mainImage}
				</div>
				<div className={styles.testimonialContent}>
					<p className={styles.testimonial__quote}>{quoteText}</p>
					<div className={styles.testimonial__person}>
						{mobileImage}
						<div className={styles.testimonial__details}>
							<p className={styles.testimonial__name}>{quoteName}</p>
							<p className={styles.testimonial__job}>{quoteRole}</p>
						</div>
					</div>
					{/* TODO: Need to fix style issues from <picture> tag when adding storyBlokImage */}

					{(variant === "fullWidth" || variant === "fullWidthWhite") &&
					link !== undefined ? (
						<div>
							<Link href="" className={styles.testimonial__link}>
								Read the Story
							</Link>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};
