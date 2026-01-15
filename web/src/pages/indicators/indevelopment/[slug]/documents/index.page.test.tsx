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
		statusSlug = "indevelopment",
		resolvedUrl = `/${productRoot}/${statusSlug}/${slug}/documents`,
		context: DocumentsPageGetServerSidePropsContext = {
			params: { slug },
			query: {
				productRoot,
				statusSlug,
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
					`Project documents | GID-DG10049 | Indicators`
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
			).toEqual("/guidance/indevelopment/gid-dg10049/documents/html-content");

			expect(
				result.props.project.groups[3].subGroups[0].resourceLinks[1].href
			).toEqual(
				"/guidance/indevelopment/gid-dg10049/downloads/gid-dg10049-final-scope.pdf"
			);
		});

		it.todo(
			"should generate correct anchor for each of consultation comments, normal consultation, download and HTML document"
		);
	});
});

describe("/indicators/prioritisation/[slug]/documents - getServerSideProps for External links", () => {
	const slug = "gid-dg10017",
		productRoot = "guidance",
		statusSlug = "prioritisation",
		resolvedUrl = `/${productRoot}/${statusSlug}/${slug}/documents`,
		context: DocumentsPageGetServerSidePropsContext = {
			params: { slug },
			query: {
				productRoot,
				statusSlug,
			},
			resolvedUrl,
		} as unknown as DocumentsPageGetServerSidePropsContext;

	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({ asPath: resolvedUrl });
	});

	describe("getServerSideProps", () => {
		it("should return a correct props for external links", async () => {
			const result = await getServerSideProps(context);

			expect(result).toMatchSnapshot();
		});

		it("should include external links for committee meetings, diagnostics consultation, notes and declaration of interests", async () => {
			const result = (await getServerSideProps(
				context as DocumentsPageGetServerSidePropsContext
			)) as {
				props: DocumentsPageProps;
			};

			const groups = result.props.project.groups;

			// helper to collect all hrefs for a group
			const hrefsForGroup = (groupIndex: number) =>
				groups[groupIndex].subGroups.flatMap((sg) =>
					sg.resourceLinks.map((rl) => rl.href)
				);

			// Committee meetings (group 0)
			expect(hrefsForGroup(0)).toEqual(
				expect.arrayContaining([
					"https://www.test-external-link3.co.uk/",
					"https://www.test-external-link4.co.uk/",
				])
			);

			// Declaration of interests (group 1)
			expect(hrefsForGroup(1)).toEqual(
				expect.arrayContaining([
					"https://www.test-external-link.co.uk/",
					"https://www.test-external-link2.co.uk/",
				])
			);

			// Diagnostics consultation (group 2)
			expect(hrefsForGroup(2)).toEqual(
				expect.arrayContaining([
					"https://www.test-external-links7.co.uk/",
					"https://www.test-external-links8.co.uk/",
				])
			);

			// Notes (group 3)
			expect(hrefsForGroup(3)).toEqual(
				expect.arrayContaining([
					"https://www.test-external-link5.co.uk/",
					"https://www.test-external-link6.co.uk/",
				])
			);
		});
	});
});

describe("/indicators/prioritisation/[slug]/documents - DocumentsPage with external links", () => {
	const slug = "gid-dg10017",
		productRoot = "guidance",
		statusSlug = "prioritisation",
		resolvedUrl = `/${productRoot}/${statusSlug}/${slug}/documents`,
		context: DocumentsPageGetServerSidePropsContext = {
			params: { slug },
			query: {
				productRoot,
				statusSlug,
			},
			resolvedUrl,
		} as unknown as DocumentsPageGetServerSidePropsContext;

	describe("DocumentsPage with external links", () => {
		let props: DocumentsPageProps;
		beforeEach(async () => {
			props = (
				(await getServerSideProps(context)) as {
					props: DocumentsPageProps;
				}
			).props;
			(useRouter as jest.Mock).mockReturnValue({ asPath: resolvedUrl });
		});

		it("should match snapshot for project documents content", () => {
			render(<DocumentsPage {...props} />);
			expect(document.body).toMatchSnapshot();
		});
	});
});
