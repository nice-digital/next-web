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
	link?: ReactElement | null;
}

export interface TestimonialLinkProps {
	[prop: string]: unknown;
	destination?: string;
	elementType?: React.ElementType;
	method?: string;
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

	const cloneElementWithClassNames = <T extends ReactElement>(
		element: T | undefined,
		...additionalClassNames: string[]
	  ): T | null => {
		if (!isValidElement(element)) return null;

		const { className, alt, ...restProps } = element.props as Record<string, any>;

		return cloneElement(
		  element,
		  {
			...restProps,
			className: classnames(className, ...additionalClassNames),
			...(element.type === "img" && { alt: alt || "Testimonial image" }),
		  }
		) as T;
	  };


	const linkElement = cloneElementWithClassNames(link as ReactElement, styles.testimonial__link);

	const mobileImage = cloneElementWithClassNames(
		image as ReactElement,
		styles.testimonial__image,
		styles.testimonial__imageMobile
	);

	const mainImage = cloneElementWithClassNames(
		image as ReactElement,
		styles.testimonial__image
	);


	return (
		<div
			className={testimonialClasses}
			data-component={`testimonial${variant ? `--${variant}` : ""}`}
			data-testid={`testimonial-${variant}`}
			{...rest}
		>
			<div className={styles.testimonial__mainContent}>
				<figure className={styles.testimonial__content}>
					<blockquote className={styles.testimonial__quote}>{quoteText}</blockquote>
					<figcaption className={styles.testimonial__person}>
						{mobileImage}

						<p className={styles.testimonial__details}>
							<span className={styles.testimonial__name}>{quoteName}</span>
							<span className={styles.testimonial__job}>{quoteRole}</span>
						</p>
						</figcaption>

					{/* TODO: Need to add display:flex to <picture> tag when adding storyBlokImage */}

					{(variant === "fullWidth" || variant === "fullWidthWhite") &&
						linkElement}
				</figure>

				<div className={styles.testimonial__mainImageContainer}>
					{mainImage}
				</div>
			</div>
		</div>
	);
};
