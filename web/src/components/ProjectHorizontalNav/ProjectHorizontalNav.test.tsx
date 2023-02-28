import { render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

import {
	ProjectHorizontalNav,
	type ProjectHorizontalNavProps,
} from "./ProjectHorizontalNav";

const props: ProjectHorizontalNavProps = {
	projectPath: "/indicators/ind1-test",
	hasDocuments: true,
	consultations: [{ title: "consultation 1" }],
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
			screen.getByRole("link", { name: "Project Information" })
		).toBeInTheDocument();
	});

	it.todo(
		"should highlight project information nav link when on the project overview page"
	);
});
