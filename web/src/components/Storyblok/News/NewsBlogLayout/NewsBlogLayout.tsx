import React, { ReactElement, ReactNode, forwardRef, useRef } from "react";

import { Grid, GridItem } from "@nice-digital/nds-grid";

import { NewsLetterSignup } from "@/components/NewsLetterSignUp/NewsLetterSignup";

import styles from "./NewsBlogLayout.module.scss";

export interface NewsBlogLayoutProps {
	header: ReactElement;
	children: ReactNode;
	sidebar?: ReactElement;
}

export const NewsBlogLayout = forwardRef<HTMLElement, NewsBlogLayoutProps>(
	({ header, children, sidebar }, ref) => {
		return (
			<article className={styles.newsSectionArticle} ref={ref}>
				<Grid>
					{/* page header */}
					<GridItem cols={12}>{header}</GridItem>

					{/* article content */}
					<GridItem cols={12} md={{ cols: 7 }}>
						{children}
					</GridItem>

					{/* article sidebar */}
					{sidebar && (
						<GridItem
							className={styles.articleSidebar}
							cols={12}
							elementType="aside"
							md={{ cols: 4, push: 1 }}
						>
							{sidebar}
						</GridItem>
					)}

					{/* action banner signup */}
					<GridItem cols={12}>
						<NewsLetterSignup />
					</GridItem>
				</Grid>
			</article>
		);
	}
);
