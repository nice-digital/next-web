import dynamic from "next/dynamic";

const LoadingPlaceholder = () => <div>Loading Infogram...</div>;

export const ClientInfogramEmbed = dynamic(
	/* webpackChunkName: "infogram-embed" */
	() =>
		import("./StoryblokInfogramEmbed").then(
			(mod) => mod.StoryblokInfogramEmbed
		),
	{
		ssr: false,
		loading: () => <LoadingPlaceholder />,
	}
);
