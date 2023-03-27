import { GetServerSideProps } from "next";

import { type FormID, getForm } from "@/feeds/jotform/jotform";
import { logger } from "@/logger";

export type FormProps = {
	height: number;
	formID: FormID;
};

export const getGetServerSideProps =
	(formID: FormID): GetServerSideProps<FormProps> =>
	async ({ resolvedUrl }) => {
		try {
			const formResponse = await getForm(formID);

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
				logger.info(`Form with id ${formID} at URL ${resolvedUrl} is disabled`);
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
