import { type GetServerSideProps } from "next/types";

import { ProjectDetail } from "@/feeds/inDev/types";
import { validateRouteParams } from "@/utils/product";

export type DocumentsPageProps = {
	productPath: string;
	project: Pick<ProjectDetail, "reference" | "title">;
};

export default function DocumentsPage(props: DocumentsPageProps): JSX.Element {
	console.log({ props });
	return (
		<>
			<p>Documents page placeholder content</p>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	DocumentsPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl, query }) => {
	const result = await validateRouteParams({ params, query, resolvedUrl });

	if ("notFound" in result || "redirect" in result) return result;

	const { project, productPath } = result;

	console.log(params);
	console.log({ project });

	if (!project) return { notFound: true };

	return {
		props: {
			productPath,
			project: {
				reference: project.reference,
				title: project.title,
			},
		},
	};
};
