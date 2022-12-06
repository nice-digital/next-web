import { type GetServerSideProps } from "next/types";

import { validateRouteParams } from "@/utils/project";

export type InDevelopmentPageProps = {
	someProjectProperty: string;
};

export default function InDevelopmentPage(): JSX.Element {
	return (
		<>
			<p>Indicator in development</p>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<
	InDevelopmentPageProps,
	{ slug: string }
> = async ({ params, resolvedUrl }) => {
	const result = await validateRouteParams(params, resolvedUrl);

	if ("notFound" in result || "redirect" in result) return result;

	console.log({ result });

	return {
		props: {
			someProjectProperty: "some prop",
		},
	};
};
