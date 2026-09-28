import dynamic from "next/dynamic";

const LoadingPlaceholder = () => <div>Loading Trac Jobs...</div>;

export const ClientTracEmbed = dynamic(
	() => import("./StoryblokTracEmbed").then((mod) => mod.StoryblokTracEmbed),
	{
		ssr: false,
		loading: () => <LoadingPlaceholder />,
	}
);
