import { render, screen } from "@testing-library/react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

import ProductResourceChapterPage, {
	getServerSideProps,
} from "./[chapterSlug].page";

const productRoot = "process",
	slug = "pmg20",
	resourceId = "1967369",
	partId = "2549710189",
	partSlug = `developing-nice-guidelines-the-manual-appendices-${resourceId}-${partId}`,
	chapterSlug =
		"appendix-b-approaches-to-additional-consultation-and-commissioned-primary-research",
	resolvedUrl = `/${productRoot}/${slug}/${partSlug}/chapter/${chapterSlug}`,
	getServerSidePropsContext = {
		params: {
			slug,
			partSlug,
			chapterSlug,
		},
		resolvedUrl,
		query: {
			productRoot,
		},
	} as unknown as GetServerSidePropsContext<{
		slug: string;
		partSlug: string;
		chapterSlug: string;
	}>;

describe("/product/[slug]/resources/[partSlug]/chapter/[chapterSlug].page", () => {
	beforeEach(() => {
		(useRouter as jest.Mock).mockReturnValue({
			asPath: resolvedUrl,
		});
	});

	describe("ProductResourceChapterPage", () => {
		it("should match snapshot", async () => {
			const result = await getServerSideProps(getServerSidePropsContext);

			if ("notFound" in result || "redirect" in result) {
				throw Error(`Expected props not notFound or redirect`);
			}

			const props = await Promise.resolve(result.props),
				{ container } = render(<ProductResourceChapterPage {...props} />);

			expect(container).toMatchSnapshot();
		});

		describe("InfoAlert", () => {
			it("should not appear when alert is null or undefined", async () => {
				const result = await getServerSideProps(getServerSidePropsContext);

				if ("notFound" in result || "redirect" in result) {
					throw Error(`Expected props not notFound or redirect`);
				}

				const props = await Promise.resolve(result.props);
				const propsWithoutAlert = {
					...props,
					product: {
						...props.product,
						alert: null,
					},
				};
				render(<ProductResourceChapterPage {...propsWithoutAlert} />);
				expect(screen.queryByText("Info alert")).not.toBeInTheDocument();
			});

			it("should appear when we have an alert", async () => {
				const result = await getServerSideProps(getServerSidePropsContext);

				if ("notFound" in result || "redirect" in result) {
					throw Error(`Expected props not notFound or redirect`);
				}

				const props = await Promise.resolve(result.props);
				const propsWithAlert = {
					...props,
					product: {
						...props.product,
						alert: "Info alert",
					},
				};

				render(<ProductResourceChapterPage {...propsWithAlert} />);
				expect(screen.getByText("Info alert")).toBeInTheDocument();
			});
		});
	});

	describe("getServerSideProps", () => {
		it("should return props for valid product, resource and part", async () => {
			expect(
				await getServerSideProps(getServerSidePropsContext)
			).toMatchSnapshot();
		});
	});
});
