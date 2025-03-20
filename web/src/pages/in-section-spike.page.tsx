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
					Flat structure with folders highlighted - current page and its siblings
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
	// normalise the slug by removing a trailing slash (if present)
	let slug = Array.isArray(context.query.slug)
		? context.query.slug[0]
		: context.query.slug || "";
	const normalisedSlug = slug.endsWith("/") ? slug.slice(0, -1) : slug;

	const exampleMap = {
		"implementing-nice-guidance": "563840532",
		"implementing-nice-guidance/cost-saving-resource-planning-and-audit":
			"642423873",
		"implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities":
			"642423884",
	};

	// Use the normalised slug to determine the parentID.
	const parentID =
		normalisedSlug && normalisedSlug in exampleMap
			? exampleMap[normalisedSlug as keyof typeof exampleMap]
			: undefined;

	// https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&starts_with=implementing-nice-guidance/cost-saving
	console.log("slug from querystring:", slug);
	const token = publicRuntimeConfig.storyblok.accessToken;

	// Siblings fetch - get links with the given parent_id.
	const siblingsFetchStart = performance.now();
	// Use Promise.all to run siblings and starts_with fetch concurrently.
	const siblingsPromise = fetch(
		`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=${parentID}`
	).then((res) => res.json());

	// Starts_with fetch - get all links that start with the slug.
	const startsWithFetchStart = performance.now();
	const startsWithPromise = fetch(
		`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&starts_with=${slug}`
	).then((res) => res.json());

	const [siblingsData, startsWithData] = await Promise.all([
		siblingsPromise,
		startsWithPromise,
	]);

	const siblings = siblingsData.links;
	const siblingsFetchTime = performance.now() - siblingsFetchStart;
	const siblingsDataSize = JSON.stringify(siblingsData.links).length;
	const siblingsCount = Object.keys(siblingsData.links).length;

	// we need other pages with the parent's parent id...
	// id 642423873 is the folder
	// id 563840532 is the parent id
	console.log("siblings", siblings);

	const startsWith = startsWithData.links;
	const startsWithFetchTime = performance.now() - startsWithFetchStart;
	const startsWithDataSize = JSON.stringify(startsWithData.links).length;
	const startsWithCount = Object.keys(startsWithData.links).length;

	// Determine the current folder, if any.
	const currentFolder = Object.values(startsWith).find(
		(item) => item.is_folder && item.slug === slug
	);

	// Conditionally fetch parent's siblings if currentFolder exists and has a parent_id.
	let parentAndSiblings = {};
	let parentFetchTime = 0;
	let parentDataSize = 0;
	let parentCount = 0;
	if (currentFolder && currentFolder.parent_id) {
		const parentFetchStart = performance.now();

		const parentRes = await fetch(
			`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=${currentFolder.parent_id}`
		);
		const parentData = await parentRes.json();
		parentAndSiblings = parentData.links;
		parentFetchTime = performance.now() - parentFetchStart;
		parentDataSize = JSON.stringify(parentData.links).length;
		parentCount = Object.keys(parentData.links).length;
	} else {
		// When on a top-level slug (like "implementing-nice-guidance"), we
		// use the siblings data to populate the render.
		console.log("No current folder found or current folder has no parent_id");
		parentAndSiblings = siblings;
	}

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
