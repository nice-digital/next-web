import { GetServerSidePropsContext } from "next";

import { getServerSideProps, type Params } from "./[resourceTitleId].page";

describe("[resourceTitleId].page", () => {
	describe("getServerSideProps", () => {
		it.todo("should return not found when project doesn't exist");

		it.todo(
			"should return not found when no consultation matches resourceTitleId in URL"
		);

		it.todo("should return not found if the consultation HTML is empty");

		it.todo("should return props for valid consultation");
	});

	describe("ConsultationHTMLPage", () => {
		describe("SEO", () => {
			it.todo("should render page title with consultation name");
		});

		describe("Breadcrumbs", () => {
			it.todo("should render parent breadcrumb to project overview");
			it.todo("should render consultation name as current breadcrumb");
		});

		it.todo("should render consultation HTML");
	});
});
