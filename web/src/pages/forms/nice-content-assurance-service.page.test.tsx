import { render } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { FormProps } from "@/components/JotFormPage/getGetServerSideProps";

import NiceContentAssuranceServiceForm, {
	getServerSideProps,
} from "./nice-content-assurance-service.page";

jest.mock("@/feeds/jotform/jotform", () => ({
	getForm: jest.fn().mockResolvedValue({
		responseCode: 200,
		message: "success",
		content: {
			id: "241971910941055",
			username: "nice_teams",
			title: "NICE content assurance service form",
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
			url: "https://nice.jotform.com/241971910941055",
		},
		duration: "14.98ms",
	}),
}));

describe("NiceContentAssuranceServiceForm", () => {
	it("should match snapshot", async () => {
		const props = (await getServerSideProps({
			resolvedUrl: "/forms/nice-content-assurance-service",
		} as GetServerSidePropsContext)) as { props: FormProps };

		const { container } = render(
			<NiceContentAssuranceServiceForm {...props.props} />
		);

		expect(container).toMatchSnapshot();
	});
});
