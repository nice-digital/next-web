import React from "react";

import { ActionBanner } from "@nice-digital/nds-action-banner";
import { Button } from "@nice-digital/nds-button";

import styles from "./NewsLetterSignUp.module.scss";

export const NewsLetterSignup = (): React.ReactElement => {
	const ctaButton = (
		<Button
			elementType="a"
			variant="cta"
			className={styles.signupCta}
			href="/newsletters-and-alerts"
		>
			Sign up for newsletters and alerts
		</Button>
	);

	return (
		<ActionBanner
			title="Sign up for our newsletters and alerts"
			cta={ctaButton}
		>
			Keeping you up to date with important developments at NICE.
		</ActionBanner>
	);
};
