import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import {
	ProjectHorizontalNav,
	type ProjectHorizontalNavProps,
} from "./ProjectHorizontalNav";

const props: ProjectHorizontalNavProps = {
	projectPath: "/indicators/indevelopment/ind1-test",
	hasDocuments: true,
	consultationUrls: [
		"/indicators/indevelopment/gid-ind1-test/consultations/html-content-4",
		"/indicators/indevelopment/gid-ind1-test/consultations/html-content-2",
		"/indicators/indevelopment/gid-ind1-test/consultations/html-content",
	],
};

const useRouterMock = jest.mocked(useRouter);

describe("ProjectHorizontalNav", () => {
	beforeEach(() => {
		useRouterMock.mockReturnValue({
			asPath: props.projectPath,
		} as ReturnType<typeof useRouter>);
	});

	it("should match snapshot for all nav items", () => {
		const { container } = render(<ProjectHorizontalNav {...props} />);
		expect(container).toMatchSnapshot();
	});

	it("should have Project information nav link", () => {
		render(<ProjectHorizontalNav {...props} />);
		expect(
			screen.getByRole("link", { name: "Project information" })
		).toBeInTheDocument();
	});

	it("should highlight project overview nav link when on the project overview page", () => {
		render(<ProjectHorizontalNav {...props} />);
		expect(
			screen.getByRole("link", { name: "Project information" })
		).toHaveAttribute("aria-current", "true");
	});

	it("should have Project Documents link when there are documents", () => {
		render(<ProjectHorizontalNav {...props} />);
		expect(
			screen.getByRole("link", { name: "Project documents" })
		).toBeInTheDocument();
	});

	it("should not have Project Documents link when there are no documents", () => {
		const mockProps = {
			...props,
			hasDocuments: false,
		};
		render(<ProjectHorizontalNav {...mockProps} />);

		expect(
			screen.queryByRole("link", { name: "Project documents" })
		).toBeNull();
	});

	it("should highlight Project Documents link when on the documents page", () => {
		useRouterMock.mockReturnValue({
			asPath: "/indicators/indevelopment/ind1-test/documents",
		} as ReturnType<typeof useRouter>);

		render(<ProjectHorizontalNav {...props} />);

		expect(
			screen.getByRole("link", { name: "Project documents" })
		).toHaveAttribute("aria-current", "true");
	});

	it("should highlight consultation nav link when on the consultation page", () => {
		useRouterMock.mockReturnValue({
			asPath:
				"/indicators/indevelopment/gid-ind1-test/consultations/html-content-2",
		} as ReturnType<typeof useRouter>);

		render(<ProjectHorizontalNav {...props} />);
		screen.debug;
		expect(
			screen.getByRole("link", { name: "Consultation 2" })
		).toHaveAttribute("aria-current", "true");
	});

	it("should display single consultation nav link with text 'Consultation'", () => {
		const mockProps = {
			...props,
			consultationUrls: [
				"/indicators/indevelopment/gid-ind1-test/consultations/html-content",
			],
		};

		render(<ProjectHorizontalNav {...mockProps} />);

		expect(
			screen.getByRole("link", { name: "Consultation" })
		).toBeInTheDocument();
	});

	it("should not have consultation nav link when there are no consultations", () => {
		const mockProps = {
			...props,
			consultationUrls: [],
		};

		render(<ProjectHorizontalNav {...mockProps} />);

		expect(screen.queryByRole("link", { name: "Consultation" })).toBeNull();
	});
});
