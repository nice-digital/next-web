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

const InSectionSpike = ({
	parentChildTreeArray,
	storyResult,
	siblings,
	startsWith,
	parentAndSiblingsArray,
	startsWithElse,
	parentAndSiblingsElse,
	slug,
	isChild,
}): JSX.Element => {
	return (
		<>
			<div style={{ fontSize: "small", marginTop: "1rem" }}>
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
				<br />
				<Link href="/in-section-spike-tree-structure?slug=implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults">
					implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults{" "}
				</Link>
				<br />
				<Link href="/in-section-spike-tree-structure?slug=implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/smoking-cessation">
					implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults/smoking-cessation{" "}
				</Link>
			</div>
			{console.log("storyResult", storyResult)}
			{console.log("fist Api call ,sibling", siblings)}
			{console.log("second Api call with slug ", startsWith)}
			{console.log("third Api call with slug ", parentAndSiblingsArray)}
			{console.log("startsWithElse", startsWithElse)}
			{console.log("parentAndSiblingsElse", parentAndSiblingsElse)}
			{/* <h2>In section spike</h2> */}

			<h2>In section spike</h2>
			<ul suppressHydrationWarning>
				{/* Siblings ≈ children; root page of folder will represented as the parent
				but structurally is on same level as other children of the folder */}
				{parentAndSiblingsElse.length == 0
					? parentChildTreeArray?.map((parent: Link) => (
							<li
								key={parent.id}
								style={{
									listStyle: parent.is_startpage ? "none" : "",
									marginLeft: parent.is_startpage ? "-1rem" : null,
								}}
							>
								{parent.is_startpage ? (
									<strong>{parent.name} </strong>
								) : (
									<ul style={{ listStyle: "none", marginLeft: "unset" }}>
										{!parent.is_startpage && (
											<li key={parent.id}>
												{parent.is_startpage ? (
													<strong>{parent.name} </strong>
												) : (
													parent.name
												)}
												{parent.is_folder && ` 📁`}
											</li>
										)}
									</ul>
								)}

								{/* Render childLinks if they exist */}
								{parent.childLinks && parent.childLinks.length > 0 && (
									<>
										<ul>
											{parent.childLinks.map((child: Link) => (
												<li key={child.id}>
													{child.name}
													{child.is_folder && ` 📁`}
												</li>
											))}
										</ul>
									</>
								)}
							</li>
					  ))
					: parentAndSiblingsElse?.map((parent: Link) => (
							<li
								key={parent.id}
								style={{
									listStyle: parent.is_startpage ? "none" : "",
									marginLeft: parent.is_startpage ? "-1rem" : null,
								}}
							>
								{parent.is_startpage ? (
									parent.name
								) : (
									<ul style={{ listStyle: "none", marginLeft: "unset" }}>
										{!parent.is_startpage && (
											<li key={parent.id}>
												{parent.is_startpage||parent.slug == slug ? (
													<strong>{parent.name} </strong>
												) : (
													parent.name
												)}
												{parent.is_folder && ` 📁`}
											</li>
										)}
									</ul>
								)}

								{/* Render childLinks if they exist */}
								{parent.childLinks && parent.childLinks.length > 0 && (
									<>
										<ul>
											{parent.childLinks.map((child: Link) => (
												<li key={child.id}>
													{child.slug == slug ? (
														<strong>{child.name}</strong>
													) : (
														child.name
													)}
													{child.is_folder && ` 📁`}
												</li>
											))}
										</ul>
									</>
								)}
							</li>
					  ))}
				{}
			</ul>
		</>
	);
};

// fetch data server side
export const getServerSideProps: GetServerSideProps = async (context) => {
	let isChild = false;
	// normalise the slug by removing a trailing slash (if present)
	let slug = Array.isArray(context.query.slug)
		? context.query.slug[0]
		: context.query.slug || "";
	const version = getStoryVersionFromQuery(context.query);
	const [storyResult] = await Promise.all([
		fetchStory<CategoryNavigationStoryblok | InfoPageStoryblok>(slug, version),
	]);
	console.log("storyResult", storyResult);
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

	// console.log("siblings", siblings);
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
	let startsWithElse = {};
	let parentAndSiblingsElse = {};
	const parentAndSiblingsArray = Object.values(parentAndSiblings);
	const parentChildTreeArray = await Promise.all(
		parentAndSiblingsArray.map(async (parent) => {
			const children = linksArray.filter((childLink) => {
				const isChild =
					childLink.parent_id === parent.id && !childLink.is_startpage;

				return isChild;
			});

			if (children.length > 0) {
				parent.childLinks = children;
				isChild = true;
			} else {
				parent.childLinks = [];
				if (slug.split("/").length > 1 && parent.slug === slug) {
					isChild = false;
					const noChildSlug = slug.split("/").slice(0, -1).join("/");

					const startsWithres = await fetch(
						`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&starts_with=${noChildSlug}`
					);
					const startsWithData = await startsWithres.json();
					startsWithElse = startsWithData.links;
					// console.log("noChildSlug", noChildSlug);
					const currentFolder = Object.values(startsWithElse).find((item) => {
						// {
						// 	console.log("item.slug", item.slug === noChildSlug);
						// }
						return item.is_folder && item.slug === noChildSlug;
					});
					// console.log("currentFOlder", currentFolder);
					if (currentFolder && currentFolder.parent_id) {
						// console.log("inside if condn");
						const parentFetchStart = performance.now();

						const parentRes = await fetch(
							`https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&with_parent=${currentFolder.parent_id}`
						);
						const parentData = await parentRes.json();
						parentAndSiblingsElse = parentData.links;
						Object.values(parentAndSiblingsElse).map((parentelse) => {
							const children = Object.values(linksArray).filter(
								(childLink) => {
									const isChild =
										childLink.parent_id === parentelse.id &&
										!childLink.is_startpage;

									return isChild;
								}
							);
							parentelse.childLinks = children;
							// parentelse.activename = "smoking-cession";
						});
					} else {
						parentAndSiblingsElse = siblings;
						isChild = true;
					}
				}
			}
			//TODO: if there are no children, render siblings and parent-level items (i.e. same nav structure as when on parent page)

			return parent;
		})
	);

	return {
		props: {
			parentChildTreeArray,
			storyResult,
			siblings: Object.values(siblings),
			startsWith: Object.values(startsWith),
			parentAndSiblingsArray: Object.values(parentAndSiblings),
			startsWithElse: Object.values(startsWithElse),
			parentAndSiblingsElse: Object.values(parentAndSiblingsElse),
			slug,
			isChild,
		},
	};
};

export default InSectionSpike;
