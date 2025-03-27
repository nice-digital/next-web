// @ts-nocheck

import { GetServerSideProps } from "next";
import { publicRuntimeConfig } from "@/config";
import React, { useState } from "react";

// Build a tree and expand only relevant sections
const buildTree = (links, slug) => {
  const tree = {};
  const map = {};
  const slugSegments = slug.split("/");
  const expandParents = new Set();

  // Create a map of all nodes
  links.forEach((link) => {
    const segments = link.slug.split("/");
    map[link.slug] = { ...link, children: [] };
    map[link.slug].segments = segments;

    // Mark parents for expansion (only first and second segments)
    if (segments.length <= slugSegments.length && segments.join("/") === slugSegments.slice(0, segments.length).join("/")) {
      expandParents.add(link.slug);
    }
  });

  // Build the tree by assigning children to their parents
  Object.values(map).forEach((node) => {
    const parentSlug = node.segments.slice(0, -1).join("/");
    if (parentSlug && map[parentSlug]) {
      map[parentSlug].children.push(node);
    } else {
      tree[node.slug] = node; // Top-level nodes
    }
  });

  return { tree: Object.values(tree), expandParents };
};

// Recursive component to render the tree structure
const TreeNode = ({ node, expandParents }) => {
  const [isExpanded, setIsExpanded] = useState(expandParents.has(node.slug));

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li>
      <div onClick={toggleExpand} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: "0.5rem" }}>
          {node.children.length > 0 && (isExpanded ? "▼" : "▶")}
        </span>
        {node.name}
      </div>
      {isExpanded && node.children.length > 0 && (
        <ul style={{ marginLeft: "1rem" }}>
          {node.children.map((child) => (
            <TreeNode key={child.slug} node={child} expandParents={expandParents} />
          ))}
        </ul>
      )}
    </li>
  );
};

const InSectionSpike = ({ links, metrics, slug }) => {
  const { tree, expandParents } = buildTree(links, slug);


  return (
    <>
      <h2>In section spike</h2>
	  <div style={{ fontSize: "small" }}>
				<a href="/in-section-spike-tree-structure-graphql?slug=implementing-nice-guidance">
					implementing-nice-guidance{" "}
				</a>
				<br />
				<a href="/in-section-spike-tree-structure-graphql?slug=implementing-nice-guidance/cost-saving-resource-planning-and-audit">
					implementing-nice-guidance/cost-saving-resource-planning-and-audit{" "}
				</a>
				<br />
				<a href="/in-section-spike-tree-structure-graphql?slug=implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities">
					implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities{" "}
				</a>
				<br />
				<a href="/in-section-spike-tree-structure-graphql?slug=implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults">
					implementing-nice-guidance/cost-saving-resource-planning-and-audit/nice-and-health-inequalities/nice-and-core20plus5-adults{" "}
				</a>
			</div>
      <h3>GraphQL Sitemap Tree</h3>
      <ul>
        {tree.map((node) => (
          <TreeNode key={node.slug} node={node} expandParents={expandParents} />
        ))}
      </ul>
      <h4>Performance Metrics</h4>
      <ul>
        <li>Max Cost: {metrics.maxCost}</li>
        <li>Fetch Time: {metrics.fetchTime}ms</li>
        <li>Data Size: {metrics.dataSize.bytes} bytes ({metrics.dataSize.kb} KB)</li>
      </ul>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let slug = Array.isArray(context.query.slug)
    ? context.query.slug[0]
    : context.query.slug || "";
  const normalisedSlug = slug.endsWith("/") ? slug.slice(0, -1) : slug;
  const firstPathSegment = normalisedSlug.split("/")[0];

  const token = publicRuntimeConfig.storyblok.accessToken;
  const query = `
    query GetLinks {
      Links:Links(starts_with: "${firstPathSegment}") {
        items {
          slug
          name
          parentId
        }
      }
      RateLimit {
        maxCost
      }
    }
  `;

  const startTime = Date.now();
  const res = await fetch("https://gapi.storyblok.com/v1/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Token: token,
    },
    body: JSON.stringify({ query }),
  });
  const fetchTime = Date.now() - startTime;

  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL Errors:", json.errors);
    return { props: { links: [], metrics: { maxCost: 0, fetchTime: 0, dataSize: { bytes: 0, kb: 0 } }, slug: normalisedSlug } };
  }

  const links = (json.data.Links?.items || []).filter((link) =>
    link.slug.startsWith(firstPathSegment)
  );

  const maxCost = json.data.RateLimit?.maxCost || 0;
  const dataSizeBytes = JSON.stringify(json).length;
  const dataSizeKB = (dataSizeBytes / 1024).toFixed(2);

  return {
    props: {
      links,
      metrics: {
        maxCost,
        fetchTime,
        dataSize: {
          bytes: dataSizeBytes,
          kb: dataSizeKB,
        },
      },
      slug: normalisedSlug,
    },
  };
};

export default InSectionSpike;
