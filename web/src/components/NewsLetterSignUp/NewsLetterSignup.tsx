import React from "react";

import { ActionBanner } from "@nice-digital/nds-action-banner";
import { Button } from "@nice-digital/nds-button";

export const NewsLetterSignup = (): React.ReactElement => {
	const ctaButton = (
		<Button
			variant="cta"
			href="https://www.nice.org.uk/news/nice-newsletters-and-alerts"
		>
			Sign up for newsletters and alerts
		</Button>
	);

	return (
		<ActionBanner
			title="Sign up for our newsletters and alerts"
			cta={ctaButton}
		>
			Bringing you our latest news, features and guidance. Keeping you up to
			date with important developments at NICE.
		</ActionBanner>
	);
};
