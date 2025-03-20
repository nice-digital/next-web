// @ts-nocheck

import { GetServerSideProps } from "next";
import { publicRuntimeConfig } from "@/config";
import { fetchStory, getStoryVersionFromQuery } from "@/utils/storyblok";
import React from "react";
import Link from "next/link";

type Link = {
	id: string;
	name: string;
	is_folder: boolean;
};
const InSectionSpike = ({ groupedLinks }): JSX.Element => {
	return (
		<>
			<h2>In section spike</h2>
			<Link href="/in-section-spike-tree-structure?slug=implementing-nice-guidance">
				implementing-nice-guidance{" "}
			</Link>
			<br />
			<Link href="/in-section-spike-tree-structure?slug=implementing-nice-guidance/cost-saving-resource-planning-and-audit">
				implementing-nice-guidance/cost-saving-resource-planning-and-audit{" "}
			</Link>
			<br />
			<Link href="/in-section-spike-tree-structure?slug=implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities">
				implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities{" "}
			</Link>
			<h2>In section spike</h2>
			<h3>
				Flat structure with folders highlighted - current page and its siblings
			</h3>
			<p>
				*Siblings ≈ children; root page of folder will represented as the parent
				but structurally is on same level as other children of the folder
			</p>
			<ul>
				{groupedLinks?.map((parent: Link) => (
					<li key={parent.id}>
						{parent.name} {parent.is_startpage && `🏠`}{" "}
						{parent.is_folder && `📁`}
						{/* Render childLinks if they exist */}
						{parent.childLinks && parent.childLinks.length > 0 && (
							<>
								<h4>child and siblings</h4>
								<ul>
									{parent.childLinks.map((child: Link) => (
										<li key={child.id}>
											{child.name} {child.is_startpage && `🏠`}{" "}
											{child.is_folder && `📁`}
										</li>
									))}
								</ul>
							</>
						)}
					</li>
				))}
			</ul>
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
	const version = getStoryVersionFromQuery(context.query);
	const [storyResult] = await Promise.all([
		fetchStory<CategoryNavigationStoryblok | InfoPageStoryblok>(slug, version),
	]);

	const parentID = storyResult.story?.parent_id;

	// storyID 642423873 is a folder
	// id 642430829 is the root story of the parent folder
	console.log("slug from querystring:", slug);
	const token = publicRuntimeConfig.storyblok.accessToken;

	//https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&starts_with=implementing-nice-guidance/cost-saving

	const res = await fetch(
		`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=${parentID}`
	);
	const data = await res.json();
	const siblings = data.links;

	// we need other pages with the parent's parent id...
	// id 642423873 is the folder
	// id 563840532 is the parent id

	console.log("siblings", siblings);
	// find the object in siblings where the is_folder is true AND it the slug matches the current slug

	const startsWithres = await fetch(
		`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&starts_with=${slug}`
	);
	const startsWithData = await startsWithres.json();
	const startsWith = startsWithData.links;

	const currentFolder = Object.values(startsWith).find(
		(item) => item.is_folder && item.slug === slug
	);

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
	const linksArray = Object.values(siblings);
	const parentAndSiblingsArray = Object.values(parentAndSiblings);
	const groupedLinks = parentAndSiblingsArray.map((parent) => {
		const children = linksArray.filter((childLink) => {
			const isChild = childLink.parent_id === parent.id;

			return isChild;
		});

		if (children.length > 0) {
			parent.childLinks = children;
		} else {
			parent.childLinks = [];
		}

		return parent;
	});

	return {
		props: {
			groupedLinks,
		},
	};
};

export default InSectionSpike;
