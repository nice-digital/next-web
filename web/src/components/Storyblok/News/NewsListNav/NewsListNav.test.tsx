import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextRouter, useRouter } from "next/router";

import { NewsListNav } from "./NewsListNav";

jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

const destinations = [
	{ url: "/news", title: "News" },
	{ url: "/news/articles", title: "News articles" },
	{ url: "/news/in-depth", title: "In-depth" },
	{ url: "/news/blogs", title: "Blogs" },
	{ url: "/news/podcasts", title: "Podcasts" },
];

describe("NewsListNav", () => {
	let useRouterMock: jest.MockedFunction<typeof useRouter>;
	let router: Partial<NextRouter>;

	beforeEach(() => {
		router = {
			route: "/news",
			pathname: "/news",
			query: {},
			asPath: "/news",
			events: {
				on: jest.fn(),
				off: jest.fn(),
				emit: jest.fn(),
			},
			push: jest.fn(),
		};

		useRouterMock = useRouter as jest.MockedFunction<typeof useRouter>;
		useRouterMock.mockReturnValue(router as unknown as NextRouter);
	});
	afterEach(() => jest.clearAllMocks());

	it("renders correctly", () => {
		const { asFragment } = render(<NewsListNav />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("renders navigation lnks with correct titles", () => {
		render(<NewsListNav />);
		destinations.forEach((destination) => {
			expect(screen.getByText(destination.title)).toBeInTheDocument();
		});
	});

	it("renders navigation links with correct href attributes", () => {
		render(<NewsListNav />);
		destinations.forEach((destination) => {
			const link = screen.getByText(destination.title);
			expect(link).toBeInTheDocument();
			expect(link.getAttribute("href")).toBe(destination.url);
		});
	});

	it("sets aria-current attribute correctly when link is active", () => {
		render(<NewsListNav />);
		const activeLink = screen.getByText("News");
		expect(activeLink).toHaveAttribute("aria-current", "true");
	});

	it("sets does not set aria-current attribute when link is inactive", () => {
		render(<NewsListNav />);
		const activeLink = screen.getByText("Blogs");
		expect(activeLink).toHaveAttribute("aria-current", "false");
	});

	//TODO investigate whether router changes can be simulated
	it("sets aria-current attribute correctly for '/news/articles' when link is active", () => {
		router.route = "/news/articles";
		router.pathname = "/news/articles";
		router.query = { page: "4" };
		router.asPath = "/news/articles?page=4";

		render(<NewsListNav />);

		const activeLink = screen.getByText("News articles");
		expect(activeLink).toHaveAttribute("aria-current", "true");
	});

	//TODO investigate why following test causes navigation console errors
	xit("navigates to the correct destination when link is clicked", async () => {
		render(<NewsListNav />);
		const blogLink = screen.getByText("Blog") as HTMLAnchorElement;
		await userEvent.click(blogLink);
		await waitFor(() => {
			expect(blogLink.href).toBe("https://next-web-tests.nice.org.uk/blog");
			// eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
			expect(router.push).toHaveBeenCalledWith({
				pathname: "/blog",
			});
		});
	});
});
