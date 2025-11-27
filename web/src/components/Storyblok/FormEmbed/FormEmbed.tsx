import React from "react";

import { JotFormEmbed } from "@/components/JotFormEmbed/JotFormEmbed";
import { FormEmbedStoryblok } from "@/types/storyblok";

interface FormEmbedBlokProps {
	blok: FormEmbedStoryblok;
}

/** TODO: look at alternative types to handle jotFormID before we switch over forms to SB.
 *
 * jotFormID is currently typed as:
 *  - export type FormID = `${number}`;
 *
 * The Storyblok field for the formId is text, so it's typed as a string.
 *
 *  Which currently means we have to pass the value from SB like this:
 *  jotFormID={`${Number(formId)}`} which seems off.
 *
 * Type = string that only contains numeric characters.
 */

export const FormEmbed = ({ blok }: FormEmbedBlokProps): React.ReactElement => {
	const { title, formId } = blok;

	return (
		<>
			<JotFormEmbed title={title} jotFormID={`${Number(formId)}`} />
		</>
	);
};
