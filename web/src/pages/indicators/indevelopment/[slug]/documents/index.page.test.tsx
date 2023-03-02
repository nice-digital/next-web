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
		productRoot = "guidance/indevelopment/",
		resolvedUrl = `/${productRoot}/${slug}/documents`,
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
					`Project documents | Automated ankle brachial pressure index measurement devices to detect peripheral arterial disease in people with leg ulcers | Indicators | Standards and Indicators`
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
			).toEqual("/indicators/indevelopment/gid-dg10049/documents/html-content");

			expect(
				result.props.project.groups[3].subGroups[0].resourceLinks[1].href
			).toEqual(
				"/indicators/indevelopment/gid-dg10049/documents/downloads/gid-dg10049-final-scope.pdf"
			);
		});
	});
});
