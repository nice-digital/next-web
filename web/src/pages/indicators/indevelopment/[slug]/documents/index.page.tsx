import { type GetServerSideProps } from "next/types";

import { ProjectDetail } from "@/feeds/inDev/types";
import { validateRouteParams } from "@/utils/project";

export type DocumentsPageProps = {
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
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	const { project, panels, hasPanels } = result;

	console.log(params);
	console.log({ project });
	console.log({ panels });
	console.log({ hasPanels });

	if (!project) return { notFound: true };

	return {
		props: {
			project: {
				reference: project.reference,
				title: project.title,
			},
		},
	};
};
