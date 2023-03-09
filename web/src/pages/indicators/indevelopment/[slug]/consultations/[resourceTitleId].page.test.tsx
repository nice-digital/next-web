import { render, screen, within } from "@testing-library/react";
import { useRouter } from "next/router";
import { type GetServerSidePropsContext } from "next/types";

import { FeedPath } from "@/feeds/inDev/types";
import { logger } from "@/logger";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import ConsultationHTMLPage, {
	ConsultationHTMLPageProps,
	getServerSideProps,
	type Params,
} from "./[resourceTitleId].page";

const productRoot = "indicators",
	resourceTitleId = "html-content-2",
	slug = "gid-ta11102",
	resolvedUrl = `/${productRoot}/indevelopment/${slug}`,
	getServerSidePropsContext = {
		params: {
			slug,
		},
		resolvedUrl,
		query: { productRoot },
	} as unknown as GetServerSidePropsContext<{ slug: string }>;

jest.mock("@/logger", () => ({
	logger: { warn: jest.fn() },
}));

type ConsultationHTMLPagePropsContext = GetServerSidePropsContext<{
	slug: string;
	resourceTitleId: string;
}>;

describe("[resourceTitleId].page", () => {
	describe("getServerSideProps", () => {
		it("should return not found when project doesn't exist", async () => {
			const notFoundIdSlug = "gid-abc123";

			axiosJSONMock.reset();
			axiosJSONMock.onGet(new RegExp(FeedPath.ProjectDetail)).reply(404, {
				Message: "Not found",
				StatusCode: "NotFound",
			});
			addDefaultJSONFeedMocks();

			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: notFoundIdSlug,
						resourceTitleId: resourceTitleId,
					},
				})
			).toStrictEqual({
				notFound: true,
			});
		});

		it("should return not found when no consultation matches resourceTitleId in URL", async () => {
			const notFoundResourceTitleId = "non-existent-html-content";
			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ind10244",
						resourceTitleId: notFoundResourceTitleId,
					},
				})
			).toStrictEqual({
				notFound: true,
			});
		});

		it("should return not found if the consultation HTML is empty", async () => {
			axiosJSONMock.reset();
			axiosJSONMock
				.onGet(new RegExp("/guidance/GID-IND10243/consultation/html-content"))
				.reply(404, {
					Message: "Not found",
					StatusCode: "NotFound",
				});
			addDefaultJSONFeedMocks();

			expect(
				await getServerSideProps({
					...getServerSidePropsContext,
					params: {
						slug: "gid-ind10243",
						resourceTitleId: "html-content",
					},
				})
			).toStrictEqual({
				notFound: true,
			});

			expect(logger.warn as jest.Mock).toHaveBeenCalledWith(
				"Consultation HTML not found at /guidance/GID-IND10243/consultation/html-content"
			);
		});

		it.todo("should return props for valid consultation");
	});

	describe("ConsultationHTMLPage", () => {
		// const slug = "gid-dg10049",
		const slug = "gid-ta10914",
			resourceTitleId = "html-content-5",
			productRoot = "indicators",
			resolvedUrl = `/${productRoot}/indevelopment/${slug}/consultations/${resourceTitleId}`,
			context: ConsultationHTMLPagePropsContext = {
				params: { slug, resourceTitleId },
				query: {
					productRoot,
				},
				resolvedUrl,
			} as unknown as ConsultationHTMLPagePropsContext;

		let props: ConsultationHTMLPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(context)) as {
					props: ConsultationHTMLPageProps;
				}
			).props;
			(useRouter as jest.Mock).mockReturnValue({ asPath: resolvedUrl });
		});

		it("should match snapshot for main content", () => {
			render(<ConsultationHTMLPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});
		describe("SEO", () => {
			it.todo("should render page title with consultation name");
		});

		describe("Breadcrumbs", () => {
			it.todo("should render parent breadcrumb to project overview");
			it.todo("should render consultation name as current breadcrumb");
		});

		it("should render the consultation heading", () => {
			render(<ConsultationHTMLPage {...props} />);
			expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
				"Draft guidance: 1"
			);
		});
		it("should render the page last updated date in time tag with ISO date time attribute", () => {
			render(<ConsultationHTMLPage {...props} />);
			const updatedMsg = screen.getByText(
				(_c, el) =>
					el?.textContent === "This page was last updated on 22 February 2023"
			);

			const time = within(updatedMsg).getByText("22 February 2023");

			expect(time).toHaveProperty("tagName", "TIME");
			expect(time).toHaveAttribute("datetime", "2023-02-22");
		});

		it("should render consultation HTML string as HTML", () => {
			render(
				<ConsultationHTMLPage
					{...props}
					consultation={{
						html: "<p>hello</p>",
						title: "anything",
					}}
				/>
			);
			expect(screen.getByText("hello")).toHaveProperty("tagName", "P");
		});
	});
});
