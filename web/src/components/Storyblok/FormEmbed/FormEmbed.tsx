import React from "react";

import { JotFormEmbed } from "@/components/JotFormEmbed/JotFormEmbed";
import { FormEmbedStoryblok } from "@/types/storyblok";

export interface FormEmbedBlokProps {
	blok: FormEmbedStoryblok;
}

export const FormEmbed = ({ blok }: FormEmbedBlokProps): React.ReactElement => {
	const { title, formId } = blok;

	if (!title?.trim() || !formId?.trim()) {
		console.error("Form Embed is missing required properties");
		return <div>This form is not available at the moment</div>;
	}

	return <JotFormEmbed title={title} jotFormID={`${Number(formId)}`} />;
};
