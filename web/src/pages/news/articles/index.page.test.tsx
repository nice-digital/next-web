import { render } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import {
	ArticlesIndexPage,
	NewsArticlesProps,
	getServerSideProps,
} from "./index.page";

type NewsArticlesPageGetServerSidePropsContext = GetServerSidePropsContext<{
	stories: any;
	currentPage: any;
	totalResults: any;
	resultsPerPage: any;
	featuredStory: any;
}>;

const getServerSidePropsContext = {
	query: {
		page: "1",
	},
} as unknown as NewsArticlesPageGetServerSidePropsContext;

describe("/news/articles/index.page", () => {
	beforeEach(() => {
		jest.mocked(useRouter).mockReturnValue({
			asPath: "/news/articles",
			query: {
				page: "1",
			},
		} as unknown as ReturnType<typeof useRouter>);
	});

	describe("ArticlesIndexPage", () => {
		let props: NewsArticlesProps;

		beforeEach(async () => {
			props = (
				(await getServerSideProps(getServerSidePropsContext)) as {
					props: NewsArticlesProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<ArticlesIndexPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});
	});
});
