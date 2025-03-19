import { GetServerSideProps } from "next";
import { publicRuntimeConfig } from "@/config";
import React from "react";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type Link = {
  id: string;
  parent_id: string;
  slug: string;
  name: string;
  is_folder: boolean;
};

interface LinkTreeNode extends Link {
  children: LinkTreeNode[];
}

type Props = {
  tree: LinkTreeNode[];
  querySlug: string;
};

// ─────────────────────────────────────────────────────────────
// Helper: Build a tree from the flat links array
// ─────────────────────────────────────────────────────────────
function buildTree(links: Link[]): LinkTreeNode[] {
  const nodeMap: { [id: string]: LinkTreeNode } = {};
  links.forEach(link => {
    nodeMap[link.id] = { ...link, children: [] };
  });
  const tree: LinkTreeNode[] = [];
  links.forEach(link => {
    if (nodeMap[link.parent_id]) {
      nodeMap[link.parent_id].children.push(nodeMap[link.id]);
    } else {
      tree.push(nodeMap[link.id]);
    }
  });
  return tree;
}

// ─────────────────────────────────────────────────────────────
// Helper: Recursively find a path (an array of nodes) from the tree
// that leads to the node whose slug exactly matches the given slug.
// Returns null if not found.
// ─────────────────────────────────────────────────────────────
function findPathBySlug(
  nodes: LinkTreeNode[],
  slug: string
): LinkTreeNode[] | null {
  for (const node of nodes) {
    if (node.slug === slug) {
      return [node];
    }
    const childPath = findPathBySlug(node.children, slug);
    if (childPath) {
      return [node, ...childPath];
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// Helper: Render navigation recursively.
// At each level, all sibling nodes are rendered as list items.
// Only if the node is active (matches the activePath at that level) and
// if we’re not at the top-level query (activePath length > 1) do we render its children.
// ─────────────────────────────────────────────────────────────
function renderNavigation(
  nodes: LinkTreeNode[],
  activePath: LinkTreeNode[] | null,
  level: number = 0
): JSX.Element {
  return (
    <ul>
      {nodes.map(node => (
        <li key={node.id}>
          {node.name} {node.is_folder && "📁"}
          {/*
            If we're at level 0 and the activePath is only one node long,
            then we are on a top-level page, so do not render any nested children.
          */}
          {activePath &&
          activePath[level] &&
          activePath[level].id === node.id &&
          activePath.length > level + 1 &&
          (level > 0 || activePath.length > 1) &&
          node.children.length > 0
            ? renderNavigation(node.children, activePath, level + 1)
            : null}
        </li>
      ))}
    </ul>
  );
}

// ─────────────────────────────────────────────────────────────
// Component: InSectionSpike
// ─────────────────────────────────────────────────────────────
const InSectionSpike = ({ tree, querySlug }: Props): JSX.Element => {
  // Normalize query slug to ensure trailing slash.
  const normalizedSlug = querySlug.endsWith("/") ? querySlug : querySlug + "/";
  // Compute the active path (from the root down to the matching node).
  const activePath = findPathBySlug(tree, normalizedSlug);
  return (
    <div>
      <h2>In Section Navigation</h2>
      {activePath ? (
        // Render navigation using the active path.
        renderNavigation(tree, activePath)
      ) : (
        <p>No navigation found for {normalizedSlug}</p>
      )}
      <p>Query slug: {querySlug}</p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Server-Side Data Fetching
// ─────────────────────────────────────────────────────────────
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the query slug from the URL.
  const querySlug = Array.isArray(context.query.slug)
    ? context.query.slug[0]
    : context.query.slug || "";
  console.log("slug from querystring:", querySlug);
  const token = publicRuntimeConfig.storyblok.accessToken;
  const res = await fetch(
    `https://api.storyblok.com/v2/cdn/links?version=published&token=${token}&starts_with=${querySlug}`
  );
  const data = await res.json();
  const siblingsObj = data.links; // flat object keyed by UUID
  const linksArray: Link[] = Object.values(siblingsObj);
  const tree = buildTree(linksArray);
  console.log("Computed tree:", tree);
  return {
    props: {
      tree,
      querySlug,
    },
  };
};

export default InSectionSpike;
