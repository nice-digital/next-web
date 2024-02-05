import { render } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { FormProps } from "@/components/JotFormPage/getGetServerSideProps";

import SubscribeToOurGPReferencePanelForm, {
	getServerSideProps,
} from "./subscribe-to-our-gp-reference-panel.page";

jest.mock("@/feeds/jotform/jotform", () => ({
	getForm: jest.fn().mockResolvedValue({
		responseCode: 200,
		message: "success",
		content: {
			id: "232422582693863",
			username: "nice_teams",
			title: "Subscribe to our GP reference panel",
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
			url: "https://nice.jotform.com/232422582693863",
		},
		duration: "14.98ms",
	}),
}));

describe("SubscribeToOurGPReferencePanelForm", () => {
	it("should match snapshot", async () => {
		const props = (await getServerSideProps({
			resolvedUrl: "/forms/subscribe-to-our-gp-reference-panel",
		} as GetServerSidePropsContext)) as { props: FormProps };

		const { container } = render(
			<SubscribeToOurGPReferencePanelForm {...props.props} />
		);

		expect(container).toMatchSnapshot();
	});
});
