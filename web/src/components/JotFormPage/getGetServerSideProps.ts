import { GetServerSideProps } from "next";

import { type FormID, getForm } from "@/feeds/jotform/jotform";
import { logger } from "@/logger";

export type FormProps = {
	height: number;
	formID: FormID;
};

// Note: this is a separate file rather than named export from the page component, because the NextJS tree shaking was trying to include needle client side, and causing a build error
export const getGetServerSideProps =
	(formID: FormID): GetServerSideProps<FormProps> =>
	async ({ resolvedUrl }) => {
		try {
			const formResponse = await getForm(
				formID,
				process.env.SERVER_FEEDS_JOTFORM_API_KEY!,
				process.env.PUBLIC_JOTFORM_BASE_URL!
			);

			if (formResponse.responseCode === 404) {
				logger.info(
					`Couldn't find form with id ${formID} at URL ${resolvedUrl}`
				);
				return { notFound: true };
			} else if (formResponse.responseCode === 401)
				throw Error(
					`Got 401 unauthorized response for form with id ${formID} at URL ${resolvedUrl}`
				);

			const { height, status } = formResponse.content;

			if (status === "DISABLED") {
				logger.warn(`Form with id ${formID} at URL ${resolvedUrl} is disabled`);
				return { notFound: true };
			}

			return {
				props: {
					height,
					formID,
				},
			};
		} catch (e) {
			logger.error(
				`Could not get form from JotForm API with id ${formID} at URL ${resolvedUrl}`,
				e
			);
			throw e;
		}
	};
