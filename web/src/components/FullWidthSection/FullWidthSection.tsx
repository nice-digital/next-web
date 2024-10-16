import classnames from "classnames";

import { Container } from "@nice-digital/nds-container";

import styles from "./FullWidthSection.module.scss";

export interface FullWidthSectionProps {
	theme?: "subtle" | "impact" | "transparent";
	verticalPadding?: "small" | "medium" | "large";
	children: React.ReactNode;
}

export const FullWidthSection: React.FC<FullWidthSectionProps> = ({
	theme = "subtle",
	verticalPadding = "medium",
	children,
}: FullWidthSectionProps) => {
	//TODO: add className based on theme
	const sectionClassName = classnames(styles.fullWidth, {
		[styles.themeSubtle]: theme === "subtle",
		[styles.themeImpact]: theme === "impact",
		[styles.themeTransparent]: theme === "transparent",
		[styles.verticalPaddingSmall]: verticalPadding === "small",
		[styles.verticalPaddingMedium]: verticalPadding === "medium",
		[styles.verticalPaddingLarge]: verticalPadding === "large",
	});

	return (
		<div className={sectionClassName}>
			<Container>{children}</Container>
		</div>
	);
};
