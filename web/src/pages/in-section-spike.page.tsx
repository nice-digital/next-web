// @ts-nocheck

import { GetServerSideProps } from "next";
import { publicRuntimeConfig } from "@/config";
import React from "react";

type Link = {
	id: string;
	name: string;
	is_folder: boolean;
	is_startpage?: boolean;
	slug?: string;
};

type Metrics = {
	siblingsFetchTime: string;
	siblingsDataSize: string;
	siblingsCount: number;
	startsWithFetchTime: string;
	startsWithDataSize: string;
	startsWithCount: number;
	parentFetchTime: string;
	parentDataSize: string;
	parentCount: number;
};

type Props = {
	siblings: { [key: string]: Link };
	parentAndSiblings: { [key: string]: Link };
	metrics: Metrics;
};

const InSectionSpike = ({
	siblings,
	parentAndSiblings,
	metrics,
}: Props): JSX.Element => {
	const linksArray = Object.values(siblings);
	const parentAndSiblingsArray = Object.values(parentAndSiblings);

	return (
		<>
			<h2>In section spike</h2>
			<ul>
				<h3>
					Flat structure with folders highlighted - current page and its
					siblings
				</h3>
				{linksArray.map((link: Link) => (
					<li key={link.id}>
						{link.name} {link.is_startpage && `🏠`}
						{link.is_folder && `📁`}
					</li>
				))}
			</ul>
			<ul>
				<h3>
					Flat structure with folders highlighted - parent page and its siblings
				</h3>
				{parentAndSiblingsArray.map((link: Link) => (
					<li key={link.id}>
						{link.name} {link.is_startpage && `🏠`}
						{link.is_folder && `📁`}
					</li>
				))}
			</ul>

			<div>
				<h3>Performance Metrics</h3>
				<p>Siblings fetch time: {metrics.siblingsFetchTime} ms</p>
				<p>Siblings nodes processed: {metrics.siblingsCount}</p>
				<p>Siblings data size: {metrics.siblingsDataSize} KB</p>
				<p>Starts_with fetch time: {metrics.startsWithFetchTime} ms</p>
				<p>Starts_with nodes processed: {metrics.startsWithCount}</p>
				<p>Starts_with data size: {metrics.startsWithDataSize} KB</p>
				<p>Parent fetch time: {metrics.parentFetchTime} ms</p>
				<p>Parent nodes processed: {metrics.parentCount}</p>
				<p>Parent data size: {metrics.parentDataSize} KB</p>
			</div>
		</>
	);
};


// fetch data server side
export const getServerSideProps: GetServerSideProps = async (context) => {
	const slug = Array.isArray(context.query.slug)
		? context.query.slug[0]
		: context.query.slug;

	const exampleMap = {
		"implementing-nice-guidance": "563840532",
		"implementing-nice-guidance/cost-saving-resource-planning-and-audit":
			"642423873",
		"implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities":
			"642423884",
	};

	const parentID =
		slug && slug in exampleMap
			? exampleMap[slug as keyof typeof exampleMap]
			: undefined;

	//https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&starts_with=implementing-nice-guidance/cost-saving
	console.log("slug from querystring:", slug);
	const token = publicRuntimeConfig.storyblok.accessToken;


	const siblingsFetchStart = performance.now();

	const res = await fetch(
		`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=${parentID}`
	);
	const data = await res.json();
	const siblings = data.links;
	const siblingsFetchTime = performance.now() - siblingsFetchStart;
	const siblingsDataSize = JSON.stringify(data.links).length;
	const siblingsCount = Object.keys(data.links).length;

	// we need other pages with the parent's parent id...
	// id 642423873 is the folder
	// id 563840532 is the parent id
	console.log("siblings", siblings);


	const startsWithFetchStart = performance.now();

	const startsWithres = await fetch(
		`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&starts_with=${slug}`
	);
	const startsWithData = await startsWithres.json();
	const startsWith = startsWithData.links;

	const startsWithFetchTime = performance.now() - startsWithFetchStart;
	const startsWithDataSize = JSON.stringify(startsWithData.links).length;
	const startsWithCount = Object.keys(startsWithData.links).length;

	const currentFolder = Object.values(startsWith).find(
		(item) => item.is_folder && item.slug === slug
	);

	const parentFetchStart = performance.now();

	const parentRes = await fetch(
		`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=${currentFolder.parent_id}`
	);

	const parentData = await parentRes.json();
	const parentAndSiblings = parentData.links;
	const parentFetchTime = performance.now() - parentFetchStart;
	const parentDataSize = JSON.stringify(parentData.links).length;
	const parentCount = Object.keys(parentData.links).length;

	console.log("parentAndSiblings >>>>>>", parentAndSiblings);

	return {
		props: {
			siblings,
			parentAndSiblings,
			metrics: {
				siblingsFetchTime: siblingsFetchTime.toFixed(2),
				siblingsDataSize: (siblingsDataSize / 1024).toFixed(2),
				siblingsCount,
				startsWithFetchTime: startsWithFetchTime.toFixed(2),
				startsWithDataSize: (startsWithDataSize / 1024).toFixed(2),
				startsWithCount,
				parentFetchTime: parentFetchTime.toFixed(2),
				parentDataSize: (parentDataSize / 1024).toFixed(2),
				parentCount,
			},
		},
	};
};

export default InSectionSpike;
