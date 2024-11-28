import { render, screen, within } from "@testing-library/react";
import { useRouter } from "next/router";
import { type GetServerSidePropsContext } from "next/types";

import { FeedPath } from "@/feeds/inDev/types";
import { logger } from "@/logger";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import ConsultationHTMLPage, {
	ConsultationHTMLPageProps,
	getServerSideProps,
} from "./[resourceTitleId].page";

const productRoot = "guidance",
	statusSlug = "indevelopment",
	resourceTitleId = "html-content-2",
	slug = "gid-ta11102",
	resolvedUrl = `/${productRoot}/${statusSlug}/${slug}`,
	getServerSidePropsContext = {
		params: {
			slug,
		},
		resolvedUrl,
		query: { productRoot, statusSlug },
	} as unknown as GetServerSidePropsContext<{ slug: string }>;

jest.mock("@/logger", () => ({
	logger: { info: jest.fn(), warn: jest.fn() },
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
						// slug: "gid-ind10244",
						slug,
						resourceTitleId: notFoundResourceTitleId,
					},
					query: { productRoot, statusSlug },
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
					resolvedUrl: "/indicators/indevelopment/gid-ind10243",
					query: { productRoot: "indicators", statusSlug },
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
		const slug = "gid-ta10914",
			resourceTitleId = "html-content-5",
			productRoot = "guidance",
			statusSlug = "indevelopment",
			resolvedUrl = `/${productRoot}/${statusSlug}/${slug}/consultations/${resourceTitleId}`,
			context: ConsultationHTMLPagePropsContext = {
				params: { slug, resourceTitleId },
				query: {
					productRoot,
					statusSlug,
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
			it("should render page title with document name", () => {
				render(
					<ConsultationHTMLPage
						{...props}
						consultation={{ title: "Test consultation title", html: "" }}
					/>
				);

				expect(document.title).toBe(
					"Test consultation title | GID-TA10914 | Indicators"
				);
			});
		});

		describe("Breadcrumbs", () => {
			it("should render parent breadcrumb linking to the project overview", () => {
				render(<ConsultationHTMLPage {...props} />);
				expect(
					screen.queryByText("GID-TA10914", {
						selector: ".breadcrumbs a",
					})
				).toHaveAttribute("href", "/indicators/indevelopment/gid-ta10914");
			});

			it("should render resource title as current breadcrumb", () => {
				render(
					<ConsultationHTMLPage
						{...props}
						consultation={{ title: "Test consultation title", html: "" }}
					/>
				);

				expect(
					screen.getByText("Test consultation title", {
						selector: ".breadcrumbs .breadcrumbs__crumb span",
					})
				).toBeInTheDocument();
			});
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
