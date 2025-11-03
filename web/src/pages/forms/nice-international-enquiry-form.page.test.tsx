import { render } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { FormProps } from "@/components/JotFormPage/getGetServerSideProps";

import InternationalEnquiryForm, {
	getServerSideProps,
} from "./nice-international-enquiry-form.page";

jest.mock("@/feeds/jotform/jotform", () => ({
	getForm: jest.fn().mockResolvedValue({
		responseCode: 200,
		message: "success",
		content: {
			id: "251406008775355",
			username: "nice_teams",
			title: "NICE International enquiry",
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
			url: "https://nice.jotform.com/251406008775355",
		},
		duration: "14.98ms",
	}),
}));

describe("InternationalEnquiryForm", () => {
	it("should match snapshot", async () => {
		const props = (await getServerSideProps({
			resolvedUrl: "/forms/nice-international-enquiry-form",
		} as GetServerSidePropsContext)) as { props: FormProps };

		const { container } = render(<InternationalEnquiryForm {...props.props} />);

		expect(container).toMatchSnapshot();
	});
});
