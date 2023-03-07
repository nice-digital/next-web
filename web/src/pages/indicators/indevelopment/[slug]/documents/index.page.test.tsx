import { render, waitFor } from "@testing-library/react";
import { type GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import DocumentsPage, {
	getServerSideProps,
	DocumentsPageProps,
} from "./index.page";

type DocumentsPageGetServerSidePropsContext = GetServerSidePropsContext<{
	slug: string;
}>;

describe("/indicators/indevelopment/[slug]/documents", () => {
	const slug = "gid-dg10049",
		productRoot = "guidance",
		resolvedUrl = `/${productRoot}/indevelopment/${slug}/documents`,
		context: DocumentsPageGetServerSidePropsContext = {
			params: { slug },
			query: {
				productRoot,
			},
			resolvedUrl,
		} as unknown as DocumentsPageGetServerSidePropsContext;

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({ asPath: resolvedUrl });
	});

	describe("DocumentsPage", () => {
		let props: DocumentsPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(context)) as {
					props: DocumentsPageProps;
				}
			).props;
		});

		it("should match snapshot for main content", () => {
			render(<DocumentsPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});

		it("should render the page title with reversed breadcrumbs for SEO", async () => {
			render(<DocumentsPage {...props} />);
			await waitFor(() => {
				expect(document.title).toEqual(
					`Project documents | GID-DG10049 | Indicators | Standards and Indicators`
				);
			});
		});
	});

	describe("getServerSideProps", () => {
		it("should return a correct props", async () => {
			const result = await getServerSideProps(context);

			expect(result).toMatchSnapshot();
		});

		it("should return a correct props for href", async () => {
			const result = (await getServerSideProps(
				context as DocumentsPageGetServerSidePropsContext
			)) as {
				props: DocumentsPageProps;
			};

			expect(
				result.props.project.groups[0].subGroups[0].resourceLinks[0].href
			).toEqual(
				"/indicators/indevelopment/gid-dg10049/consultations/html-content"
			);

			expect(
				result.props.project.groups[3].subGroups[0].resourceLinks[1].href
			).toEqual(
				"/indicators/indevelopment/gid-dg10049/downloads/gid-dg10049-final-scope.pdf"
			);
		});

		it.todo(
			"should generate correct anchor for each of consultation comments, normal consultation, download and HTML document"
		);
	});
});
