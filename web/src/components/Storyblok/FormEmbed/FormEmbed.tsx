import Script from "next/script";
import React, {useEffect} from "react";
import { render } from "storyblok-rich-text-react-renderer";

import { FormEmbed } from "@/types/storyblok";

import styles from "./FormEmbed.module.scss";

interface FormEmbedBlokProps {
	blok: FormEmbed;
}


function handleIFrameMessage(e) {
	console.log('message from iframe embed', e);
}

export const FormEmbed = ({ blok }: FormEmbedBlokProps): React.ReactElement => {

	useEffect(() => {
		window.addEventListener("message", handleIFrameMessage, false);

		return () =>
			window.removeEventListener("message", handleIFrameMessage, false);
	}, []);

	const { jotFormID } = blok;


	return (
	<>
		<h2>test form embed</h2>

		<div aria-live="polite" id="form-container"/>

		<Script
				id="jotForm"
				strategy="afterInteractive"
				onLoad={() => console.log("embed loaded")}
			>
				{`(function() {
					 if (document.getElementById("jotForm_script")) return;
						var s = document.createElement("script");
						s.id = "jotForm_script";
						s.async = true;
						s.src = "https://nice.jotform.com/jsform/${jotFormID}"
						s.setAttribute("id", "jotForm_script");
						document.getElementById("form-container").appendChild(s);
					})();`}
			</Script>
	</>
	);
};
