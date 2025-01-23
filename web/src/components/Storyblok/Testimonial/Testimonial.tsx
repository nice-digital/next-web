import React, { ReactNode } from "react";
import classnames from "classnames";
import styles from "./Testimonial.module.scss";

export interface TestimonialProps {
	variant?: "default" | "subtle" | "fullWidth" | "fullWidthSubtle";
	children: ReactNode[] | ReactNode;
	className?: string;
	image: string;
	quoteText: string;
	quoteName: string;
	quoteRole: string;
	headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export const Testimonial: React.FC<TestimonialProps> = (
	props
): JSX.Element | null => {
	const {
		variant,
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

	const classes = {
		testimonial: true,
		[`testimonial--${kebabCaseVariantClassName}`]: variant,
		[`${className}`]: className,
	};
	const HeadingLevelElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;
	return (
				<div className={styles.testimonial}>
					<div className={styles.testimonialImage}>
						<img
							src="https://avatar.iran.liara.run/public"
							alt="Person's Name"
						/>
					</div>

					<div className={styles.testimonialContent}>
						<p className={styles.testimonialQuote}>
							"This is an amazing product! Highly recommended for everyone."
						</p>
						<div className={styles.testimonialPerson}>
							<img
								className={styles.testimonialAvatar}
								src="https://avatar.iran.liara.run/public"
								alt="Person's Name"
							/>
							<div className={styles.testimonialDetails}>
								<p className={styles.testimonialName}>Jane Doe</p>
								<p className={styles.testimonialJob}>Software Engineer</p>
							</div>
						</div>
					</div>
				</div>
	);
};
