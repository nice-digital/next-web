import { render, screen, waitFor, within } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import { FeedPath } from "@/feeds/inDev/types";
import gidng10014 from "@/mockData/inDev/project/gid-ng10014.json";
import { addDefaultJSONFeedMocks, axiosJSONMock } from "@/test-utils/feeds";

import InDevelopmentPage, {
	getServerSideProps,
	InDevelopmentPageProps,
} from "./index.page";

// type InDevelopmentPageGetServerSidePropsContext = GetServerSidePropsContext<{
// 	slug: string;
// }>;

const productRoot = "indicators",
	slug = "gid-ng10014",
	resolvedUrl = `/${productRoot}/indevelopment/${slug}`,
	getServerSidePropsContext = {
		params: {
			slug,
		},
		resolvedUrl,
		query: { productRoot },
	} as unknown as GetServerSidePropsContext<{ slug: string }>;

console.log("hello ", resolvedUrl);

describe("/indevelopment/[slug].page", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockImplementation(() => ({
			// asPath: `/guidance/ng100#somewhere`,
			asPath: resolvedUrl,
		}));

		axiosJSONMock.reset();
		axiosJSONMock
			.onGet(new RegExp(FeedPath.ProjectDetail))
			.reply(200, gidng10014);
		addDefaultJSONFeedMocks();
	});

	describe("IndevelopmentPage", () => {
		let props: InDevelopmentPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(getServerSidePropsContext)) as {
					props: InDevelopmentPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<InDevelopmentPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it.skip("should render the page title with reversed breadcrumbs for SEO", async () => {
			render(<InDevelopmentPage {...props} />);
			// eslint-disable-next-line testing-library/no-debugging-utils
			console.log(screen.debug());
			await waitFor(() => {
				expect(document.title).toEqual(
					`Project information | ${gidng10014.Title} | Indicators | Standards and Indicators`
				);
			});
		});
	});
});
