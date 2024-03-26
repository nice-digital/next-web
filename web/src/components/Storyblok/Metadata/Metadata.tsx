import { NextSeo } from "next-seo";

import { type MetadataStoryblok } from "@/types/storyblok";

interface MetadataBlokProps {
	blok: MetadataStoryblok;
}

export const Metadata = ({ blok }: MetadataBlokProps): React.ReactElement => {
	const additionalMetaTags = blok.creator
		? [
				{
					property: "DC:Creator",
					content: blok.creator,
				},
		  ]
		: undefined;

	return (
		<NextSeo
			description={blok.description}
			additionalMetaTags={additionalMetaTags}
		/>
	);
};
