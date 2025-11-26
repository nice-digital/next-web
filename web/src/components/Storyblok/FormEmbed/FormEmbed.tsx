import Script from "next/script";
import React, { useEffect } from "react";
import { render } from "storyblok-rich-text-react-renderer";
import { JotFormEmbed } from "@/components/JotFormEmbed/JotFormEmbed";
// import { FormEmbed } from "@/types/storyblok";

import styles from "./FormEmbed.module.scss";

// interface FormEmbedBlokProps {
// 	blok: FormEmbed;
// }



export const FormEmbed = ({ blok }: any): React.ReactElement => {
	const { title, jotFormID } = blok;

	return (
		<>
			<JotFormEmbed title={title} jotFormID={jotFormID} />
		</>
	);
};
