import dynamic from "next/dynamic";

const LoadingPlaceholder = () => <div>Loading Trac Jobs...</div>;

export const ClientTracEmbed = dynamic(
	/* webpackChunkName: "infogram-embed" */
	() => import("./TracEmbed").then((mod) => mod.TracEmbed),
	{
		ssr: false,
		loading: () => <LoadingPlaceholder />,
	}
);
