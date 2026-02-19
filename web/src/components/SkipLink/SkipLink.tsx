import React, { FC, ReactNode, useCallback } from "react";

import styles from "./SkipLink.module.scss";

export interface SkipLinkProps {
	children: ReactNode;
	targetId: string;
}

export const focusAndScrollToTarget = (targetId: string): void => {
	const targetElement = document.getElementById(targetId) as HTMLElement | null;

	if (!targetElement) return;

	targetElement.setAttribute("tabIndex", "-1");
	targetElement.focus();
	targetElement.scrollIntoView();
};
export const SkipLink: FC<SkipLinkProps> = ({ children, targetId }) => {
	const clickHandler = useCallback(
		(e: React.MouseEvent<HTMLAnchorElement>) => {
			const targetElement = document.getElementById(targetId);

			if (targetElement) {
				e.preventDefault();

				focusAndScrollToTarget(targetId);
			}
		},
		[targetId]
	);

	return (
		<a href={`#${targetId}`} className={styles.skipLink} onClick={clickHandler}>
			{children}
		</a>
	);
};
