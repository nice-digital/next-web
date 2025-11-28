import dynamic from "next/dynamic";

export const ClientFormEmbed = dynamic(
	() => import("./FormEmbed").then((mod) => mod.FormEmbed),
	{ ssr: false, loading: () => <>Loading</> }
);
