import dynamic from "next/dynamic";

const LoadingPlaceholder = () => <div>Loading Infogram...</div>;

export const ClientInfogramEmbed = dynamic(
	/* webpackChunkName: "infogram-embed" */
	() => import("./InfogramEmbed").then((mod) => mod.InfogramEmbed),
	{
		ssr: false,
		loading: () => <LoadingPlaceholder />,
	}
);
