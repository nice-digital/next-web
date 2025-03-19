// @ts-nocheck

import { GetServerSideProps } from "next";
import { publicRuntimeConfig } from "@/config";
import React from "react";

type Link = {
	id: string;
	name: string;
	is_folder: boolean;
}
const InSectionSpike = ({ siblings, parentAndSiblings }: { siblings: Link[] }): JSX.Element => {

	const linksArray = Object.values(siblings);
	const parentAndSiblingsArray = Object.values(parentAndSiblings);


	return (
		<>
		<h2>In section spike</h2>
		<ul>
			<h3>Flat structure with folders highlighted - current page and its siblings</h3>
		{linksArray.map((link: Link) => (
			<li key={link.id}>
				{link.name} {" "}
				{link.is_startpage && `🏠`}
				{link.is_folder && `📁`}
			</li>
		))}
		</ul>
		<ul>
			<h3>Flat structure with folders highlighted - parent page and its siblings</h3>
		{parentAndSiblingsArray.map((link: Link) => (
			<li key={link.id}>
				{link.name} {" "}
				{link.is_startpage && `🏠`}
				{link.is_folder && `📁`	}
			</li>
		))}
		</ul>

		</>
	);
}


// fetch data server side
export const getServerSideProps: GetServerSideProps = async (context) => {
	const slug = Array.isArray(context.query.slug) ? context.query.slug[0] : context.query.slug;

	const exampleMap = {
        "implementing-nice-guidance": "563840532",
        "implementing-nice-guidance/cost-saving-resource-planning-and-audit": "642423873",
		"implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities": "642423884",
    }

	const parentID = slug && slug in exampleMap ? exampleMap[slug as keyof typeof exampleMap] : undefined;
	// storyID 642423873 is a folder
	// id 642430829 is the root story of the parent folder
	console.log("slug from querystring:", slug);
	const token = publicRuntimeConfig.storyblok.accessToken;

	//https://api.storyblok.com/v2/cdn/links?version=published&token=O8HhG6D7S3KeDqGrZeDMoAtt&starts_with=implementing-nice-guidance/cost-saving

	const res = await fetch(`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=${parentID}`);
	const data = await res.json();
	const siblings = data.links;

	// we need other pages with the parent's parent id...
	// id 642423873 is the folder
	// id 563840532 is the parent id

	console.log("siblings", siblings);
	// find the object in siblings where the is_folder is true AND it the slug matches the current slug

	const startsWithres = await fetch(`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&starts_with=${slug}`);
	const startsWithData = await startsWithres.json();
	const startsWith = startsWithData.links;

	const currentFolder = Object.values(startsWith).find(item => item.is_folder && item.slug === slug);


	const parentRes = await fetch(`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=${currentFolder.parent_id}`);
	const parentData = await parentRes.json();

	const parentAndSiblings = parentData.links;

	console.log("parentAndSiblings >>>>>>", parentAndSiblings);


	return {
		props: {
			siblings,
			parentAndSiblings
		}
	}
}


export default InSectionSpike;
