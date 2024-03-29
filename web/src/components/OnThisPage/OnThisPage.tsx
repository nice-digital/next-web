import throttle from "lodash.throttle";
import React, { FC, useEffect, useReducer, useState } from "react";
import striptags from "striptags";

import { Toggle } from "@/components/Toggle/Toggle";
import { useIsClient } from "@/hooks/useIsClient";

import styles from "./OnThisPage.module.scss";

const hideThreshold = 7;
const shortenedListSize = 5;
const scrollTolerance = 50;

const getActiveHeadingId = (
	linkTree: OnThisPageSection[],
	scrollTolerance: number
): string => {
	const headingsAboveViewport = linkTree
		.map(({ slug: id }) => {
			const heading = document.getElementById(id);
			return { heading, y: heading?.getBoundingClientRect().top || 0 };
		})
		.filter(({ y }) => y - scrollTolerance <= 0);

	if (headingsAboveViewport.length === 0) return "";

	return (
		headingsAboveViewport.reduce((prev, current) => {
			return prev.y > current.y ? prev : current;
		})?.heading?.id || ""
	);
};

export type OnThisPageSection = {
	slug: string;
	title: string;
};

export type OnThisPageProps = {
	sections: OnThisPageSection[];
};

export const OnThisPage: FC<OnThisPageProps> = ({ sections }) => {
	const isClient = useIsClient();
	const [isHidingMoreLinks, dispatch] = useReducer(
		() => false,
		sections.length > hideThreshold
	);

	const [activeHeadingId, setActiveHeadingId] = useState("");

	useEffect(() => {
		const scrollHandler = throttle(() => {
			setActiveHeadingId(getActiveHeadingId(sections, scrollTolerance));
		}, 100);

		setActiveHeadingId(getActiveHeadingId(sections, scrollTolerance));
		window.addEventListener("scroll", scrollHandler, { passive: true });

		return () => {
			setActiveHeadingId("");
			window.removeEventListener("scroll", scrollHandler);
		};
	}, [sections]);

	if (sections.length <= 1) return null;

	return (
		<nav aria-labelledby="on-this-page" className={styles.wrapper}>
			<h2 id="on-this-page" className={styles.heading}>
				On this page
			</h2>
			<ol
				className={styles.list}
				aria-label="Jump links to sections on this page"
			>
				{sections.map(({ slug, title }, i) => {
					return i < shortenedListSize || !isHidingMoreLinks ? (
						<li key={slug}>
							<a
								className={activeHeadingId === slug ? styles.activeHeading : ""}
								href={`#${slug}`}
								dangerouslySetInnerHTML={{ __html: striptags(title) }}
							/>
						</li>
					) : null;
				})}
			</ol>
			{isClient && isHidingMoreLinks ? (
				<button
					type="button"
					onClick={dispatch}
					className={styles.moreLinksButton}
				>
					<Toggle isOpen={false}>Show all sections</Toggle>
				</button>
			) : null}
		</nav>
	);
};
