import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextRouter, useRouter } from "next/router";

import { NewsListNav } from "./NewsListNav";

// jest.mock("next/router", () => ({
// 	useRouter: () => ({
// 		route: "/news",
// 		pathname: "/news",
// 		query: {},
// 		asPath: "/news",
// 		events: {
// 			on: jest.fn(),
// 			off: jest.fn(),
// 		},
// 		push: jest.fn(),
// 	}),
// }));

jest.mock("next/router", () => ({
	useRouter: jest.fn(),
}));

describe("NewsListNav", () => {
	const destinations = [
		{ url: "/news", title: "News" },
		{ url: "/blog", title: "Blog" },
		{ url: "/events", title: "Events" },
	];

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

	it("renders correctly", () => {
		const { asFragment } = render(<NewsListNav destinations={destinations} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("renders navigation lnks with correct titles", () => {
		render(<NewsListNav destinations={destinations} />);
		destinations.forEach((destination) => {
			expect(screen.getByText(destination.title)).toBeInTheDocument();
		});
	});

	it("renders navigation links with correct href attributes", () => {
		render(<NewsListNav destinations={destinations} />);
		destinations.forEach((destination) => {
			const link = screen.getByText(destination.title);
			expect(link).toBeInTheDocument();
			expect(link.getAttribute("href")).toBe(destination.url);
		});
	});

	it("sets aria-current attribute correctly when link is active", () => {
		render(<NewsListNav destinations={destinations} />);
		const activeLink = screen.getByText("News");
		expect(activeLink).toHaveAttribute("aria-current", "true");
	});

	it("sets does not set aria-current attribute when link is inactive", () => {
		render(<NewsListNav destinations={destinations} />);
		const activeLink = screen.getByText("Blog");
		expect(activeLink).toHaveAttribute("aria-current", "false");
	});

	it("navigates to the correct destination when link is clicked", async () => {
		render(<NewsListNav destinations={destinations} />);
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
