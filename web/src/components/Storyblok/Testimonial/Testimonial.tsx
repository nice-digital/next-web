import React, {
	ReactElement,
	ReactNode,
	isValidElement,
	cloneElement,
} from "react";
import classnames from "classnames";
import styles from "./Testimonial.module.scss";

export interface TestimonialProps {
	variant?: "default" | "transparent" | "fullWidth" | "fullWidthWhite";
	children?: ReactNode[] | ReactNode; //TODO does this component need to be able to accept children?
	className?: string;
	image?: ReactElement;
	quoteText: string;
	quoteName: string;
	quoteRole: string;
	headingLevel?: 2 | 3 | 4 | 5 | 6;
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
					styles.testimonial__mobileImage
				),
				alt: (image as ReactElement).props.alt || "Testimonial Mobile Image",
		  })
		: null;
	const mainImage = isValidElement(image)
		? cloneElement(image as ReactElement, {
				className: classnames(
					(image as ReactElement).props.className,
					styles.testimonialMainImage
				),
				alt: (image as ReactElement).props.alt || "Testimonial Main Image",
		  })
		: null;
	return (
		<div
			className={testimonialClasses}
			data-component={`testimonial${variant ? `--${variant}` : ""}`}
			{...rest}
		>
			<div className={styles.testimonialMainContent}>
				<div className={styles.testimonial__mainImageContainer}>{mainImage}</div>
				<div className={styles.testimonialContent}>
					<p className={styles.testimonial__quote}>{quoteText}</p>
					<div className={styles.testimonial__person}>
						{mobileImage}
						<div className={styles.testimonial__details}>
							<p className={styles.testimonial__name}>{quoteName}</p>
							<p className={styles.testimonial__job}>{quoteRole}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
