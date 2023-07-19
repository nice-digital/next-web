import axios from "axios";
import { JSDOM } from "jsdom";
import { GetServerSideProps } from "next";
import { useEffect } from "react";

interface ScriptData {
	innerHTML: string;
	src: string;
	type: string;
	async: boolean | null;
	defer: boolean | null;
}

interface ScriptsPageProps {
	scripts: ScriptData[];
}

const ScriptsPage = ({ scripts }: ScriptsPageProps): JSX.Element => {
	useEffect(() => {
		scripts.forEach((script) => {
			const scriptElement = document.createElement("script");
			scriptElement.innerHTML = script.innerHTML;
			document.body.appendChild(scriptElement);
		});
	}, [scripts]);

	return <div>Scripts will be rendered here.</div>;
};

export const getServerSideProps: GetServerSideProps<
	ScriptsPageProps
> = async () => {
	const url = "https://nice.jotform.com/230793530776059"; // Replace with your desired URL
	const response = await axios.get(url);

	const dom = new JSDOM(response.data);
	const scriptElements = dom.window.document.getElementsByTagName("script");

	const scripts: ScriptData[] = [];
	for (let i = 0; i < scriptElements.length; i++) {
		const script = scriptElements[i];
		const scriptData: ScriptData = {
			innerHTML: script.innerHTML,
			src: script.src,
			type: script.type,
			async: script.async !== undefined ? script.async : null,
			defer: script.defer,
		};
		scripts.push(scriptData);
	}

	return {
		props: {
			scripts,
		},
	};
};

export default ScriptsPage;
