import { render } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";

import { FormProps } from "@/components/JotFormPage/getGetServerSideProps";

import InterventionalProceduresNotificationForm, {
	getServerSideProps,
} from "./interventional-procedures-notification.page";

jest.mock("@/feeds/jotform/jotform", () => ({
	getForm: jest.fn().mockResolvedValue({
		responseCode: 200,
		message: "success",
		content: {
			id: "230793530776059",
			username: "nice_teams",
			title: "Interventional procedures notification form",
			height: "539",
			status: "ENABLED",
			created_at: "2023-03-21 09:27:18",
			updated_at: "2023-03-27 05:10:51",
			last_submission: "2023-03-24 11:33:20",
			new: "3",
			count: "3",
			type: "LEGACY",
			favorite: "0",
			archived: "0",
			url: "https://nice.jotform.com/230793530776059",
		},
		duration: "23.46ms",
	}),
}));

describe("InterventionalProceduresNotificationForm", () => {
	it("should match snapshot", async () => {
		const props = (await getServerSideProps({
			resolvedUrl: "/forms/interventional-procedures-notification",
		} as GetServerSidePropsContext)) as { props: FormProps };

		const { container } = render(
			<InterventionalProceduresNotificationForm {...props.props} />
		);

		expect(container).toMatchSnapshot();
	});
});
