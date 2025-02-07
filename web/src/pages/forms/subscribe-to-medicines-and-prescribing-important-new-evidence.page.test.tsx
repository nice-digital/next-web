import { render } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { FormProps } from "@/components/JotFormPage/getGetServerSideProps";

import MedicinesAndPrescribingNewsletterForm, {
	getServerSideProps,
} from "./subscribe-to-medicines-and-prescribing-important-new-evidence.page";

jest.mock("@/feeds/jotform/jotform", () => ({
	getForm: jest.fn().mockResolvedValue({
		responseCode: 200,
		message: "success",
		content: {
			id: "232421834202848",
			username: "nice_teams",
			title: "Subscribe to medicines and prescribing - Important new evidence",
			height: "539",
			status: "ENABLED",
			created_at: "2022-12-08 06:31:44",
			updated_at: "2023-03-27 05:03:55",
			last_submission: "2023-03-24 14:43:43",
			new: "34",
			count: "46",
			type: "LEGACY",
			favorite: "0",
			archived: "0",
			url: "https://nice.jotform.com/232421834202848",
		},
		duration: "14.98ms",
	}),
}));

describe("MedicinesAndPrescribingNewsletterForm", () => {
	xit("should match snapshot", async () => {
		const props = (await getServerSideProps({
			resolvedUrl:
				"/forms/subscribe-to-medicines-and-prescribing-important-new-evidence",
		} as GetServerSidePropsContext)) as { props: FormProps };

		const { container } = render(
			<MedicinesAndPrescribingNewsletterForm {...props.props} />
		);

		expect(container).toMatchSnapshot();
	});
});
