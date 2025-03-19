import { GetServerSideProps } from "next";
import { publicRuntimeConfig } from "@/config";
import React from "react";

const InSectionSpike = (): JSX.Element => {
	return (
		<h2>In section spike</h2>
	);
}


// fetch data server side
export const getServerSideProps: GetServerSideProps = async (context) => {
	const slug= context.query.slug;
	// parent id of implementing-nice-guidance  563840532

	console.log("slug from querystring:", slug);
	const token = publicRuntimeConfig.storyblok.accessToken;


	const res = await fetch(`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=563840532`);
	const data = await res.json();
	const links = data.links;

	console.log('links fetched:', links);
	return {
		props: {
			links
		}
	}
}


export default InSectionSpike;
