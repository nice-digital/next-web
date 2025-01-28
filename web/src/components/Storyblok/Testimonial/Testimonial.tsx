import React, { ReactNode } from "react";
import classnames from "classnames";
import styles from "./Testimonial.module.scss";

export interface TestimonialProps {
	variant?: "default" | "subtle" | "fullWidth" | "fullWidthWhite";
	children: ReactNode[] | ReactNode;
	className?: string;
	image: string; // This is the main image URL (for desktop)
	quoteText: string;
	quoteName: string;
	quoteRole: string;
	headingLevel?: 2 | 3 | 4 | 5 | 6;
	layout: "one" | "two" | "three";
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
		layout = "one",
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
	const gridClasses = classnames(styles.testimonialWrapper, {
		[styles[`testimonial--layout-${layout}`]]: layout,
	});
	const HeadingLevelElement = `h${headingLevel}` as keyof JSX.IntrinsicElements;
	console.log("gridClasses", gridClasses);
	console.log("layout", layout);
	return (
		<div
			className={testimonialClasses}
			data-component={`testimonial${variant ? `--${variant}` : ""}`}
			{...rest}
		>
				<div className={styles.testimonial__mainContent}>
					<div className={styles.testimonial__mainImage}>
						<img
							src="https://avatar.iran.liara.run/public"
							alt="Person's Name"
						/>
					</div>
					<div className={styles.testimonial__content}>
						<p className={styles.testimonial__quote}>
							"This is an amazing product! Highly recommended for everyone."
						</p>
						<div className={styles.testimonial__person}>
							{/* Avatar for mobile */}
							<img
								className={styles.testimonial__avatar}
								src="https://avatar.iran.liara.run/public"
								alt="Person's Name"
							/>
							<div className={styles.testimonial__details}>
								<p className={styles.testimonial__name}>Jane Doe</p>
								<p className={styles.testimonial__job}>Software Engineer</p>
							</div>
						</div>
					</div>
				</div>
		</div>
	);
};
