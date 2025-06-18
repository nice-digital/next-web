import dynamic from "next/dynamic";

// loading placeholder for the infogram embed.
// Used for dynamic import
const LoadingPlaceholder = () => <div>Loading Infogram...</div>;

// how do we test next/dynamic?
export const ClientInfogramEmbed = dynamic(
	() => import("./InfogramEmbed").then((mod) => mod.InfogramEmbed),
	{
		ssr: false,
		loading: () => <LoadingPlaceholder />,
	}
);
