import React from "react";

import { JotFormEmbed } from "@/components/JotFormEmbed/JotFormEmbed";
import { FormEmbedStoryblok } from "@/types/storyblok";

export interface FormEmbedBlokProps {
	blok: FormEmbedStoryblok;
}

export const FormEmbed = ({ blok }: FormEmbedBlokProps): React.ReactElement => {
	const { title, formId } = blok;

	return (
		<>
			<JotFormEmbed title={title} jotFormID={`${Number(formId)}`} />
		</>
	);
};
