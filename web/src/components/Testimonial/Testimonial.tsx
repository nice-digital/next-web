import classnames from "classnames";
import React, { ReactElement, isValidElement, cloneElement } from "react";

import styles from "./Testimonial.module.scss";

export interface TestimonialProps {
	variant?: "default" | "transparent" | "fullWidth" | "fullWidthWhite";
	className?: string;
	image?: ReactElement;
	quoteText: string;
	quoteName: string;
	quoteRole: string;
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
		className,
		link = undefined,
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

		const { className, alt, ...restProps } = element.props as {
			className?: string;
			alt?: string;
			[key: string]: unknown;
		};

		return cloneElement(element, {
			...restProps,
			className: classnames(className, ...additionalClassNames),

			...(element.type === "img" && {
				alt: alt || "Testimonial image",
				role: "img",
				"aria-label": alt || "Testimonial image",
			}),
		}) as T;
	};

	const linkElement = cloneElementWithClassNames(
		link as ReactElement,
		styles.testimonial__link
	);

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
			data-tracking="testimonial"
			{...rest}
		>
			<div className={styles.testimonial__mainContent}>
				<figure className={styles.testimonial__content}>
					<blockquote className={styles.testimonial__quote}>
						{quoteText}
					</blockquote>
					<figcaption className={styles.testimonial__person}>
						{mobileImage}

						<p className={styles.testimonial__details}>
							<span className={styles.testimonial__name}>{quoteName}</span>
							<span className={styles.testimonial__job}>{quoteRole}</span>
						</p>
					</figcaption>

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
