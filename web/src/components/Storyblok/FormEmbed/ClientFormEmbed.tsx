import dynamic from "next/dynamic";

export const ClientFormEmbed = dynamic(
	() => import("./FormEmbed").then((mod) => mod.FormEmbed),
	{
		ssr: false,
		loading: () => (
			<div>
				<p>Loading form, please wait</p>
			</div>
		),
	}
);
