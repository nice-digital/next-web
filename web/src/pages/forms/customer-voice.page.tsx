import { useEffect } from "react";

import styles from "./customer-voice.module.scss";

declare global {
	interface Window {
		SurveyEmbed: {
			new (key: string, url: string, cdn: string, flag: string): {
				renderInline: (
					containerId: string,
					options: { [key: string]: string }
				) => void;
			};
		};
	}
}

const SurveyForm = () => {
	useEffect(() => {
		// Ensure the SurveyEmbed library is initialized when the component is mounted
		if (typeof window !== "undefined" && window.SurveyEmbed) {
			const se = new window.SurveyEmbed(
				"efQwYEKzLUel3XQP91ON6f_irU_BojdJkCddYL2bpcVUOTJJOEhUQkdFQ1pIMzY3RU9FMUhDNlRCOC4u",
				"https://customervoice.microsoft.com/",
				"https://mfpembedcdnweu.azureedge.net/mfpembedcontweu/",
				"true"
			);
			se.renderInline("survey-container", {
				"First Name": "John",
				"Last Name": "Doe",
				locale: "en-US",
			});
		}
	}, []);

	return <div id="survey-container" className={styles.surveyContainer} />;
};

export default function CustomerVoiceTestForm(): JSX.Element {
	return (
		<>
			<SurveyForm />
		</>
	);
}
