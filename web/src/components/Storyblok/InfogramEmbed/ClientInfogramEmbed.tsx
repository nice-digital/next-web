import dynamic from "next/dynamic";

// loading placeholder for the infogram embed.
// Used for dynamic import
const LoadingPlaceholder = () => <div>Loading Infogram...</div>;

export const ClientInfogramEmbed = dynamic(() => import("./InfogramEmbed"), {
	ssr: false,
	loading: () => <LoadingPlaceholder />,
});

export default ClientInfogramEmbed;
