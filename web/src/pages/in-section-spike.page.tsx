import { GetServerSideProps } from "next";
import { publicRuntimeConfig } from "@/config";
import React from "react";

type Link = {
	id: string;
	name: string;
	is_folder: boolean;
}
const InSectionSpike = ({ siblings }: { siblings: Link[] }): JSX.Element => {

	const linksArray = Object.values(siblings);


	return (
		<>
		<h2>In section spike</h2>
		<ul>
			<h3>Flat structure with folders highlighted</h3>
		{linksArray.map((link: Link) => (
			<li key={link.id}>
				{link.name} {" "}
				{link.is_folder && `📁`}
			</li>
		))}
		</ul></>
	);
}


// fetch data server side
export const getServerSideProps: GetServerSideProps = async (context) => {
	const slug = Array.isArray(context.query.slug) ? context.query.slug[0] : context.query.slug;
	const exampleMap = {
		"implementing-nice-guidance": "563840532",
		"implementing-nice-guidance/cost-saving-resource-planning-and-audit": "642423873"
	}

	// storyID 642423873 is a folder
	// id 642430829 is the root story of the parent folder
	const parentID = slug && slug in exampleMap ? exampleMap[slug as keyof typeof exampleMap] : undefined;
	console.log("slug from querystring:", slug);
	const token = publicRuntimeConfig.storyblok.accessToken;


	const res = await fetch(`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=${parentID}`);
	const data = await res.json();
	const siblings = data.links;

	// we need other pages with the parent's parent id...




	return {
		props: {
			siblings,
		}
	}
}


export default InSectionSpike;
