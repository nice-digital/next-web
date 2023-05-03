import React, { type PropsWithChildren, type FC } from "react";

import styles from "./DefinitionList.module.scss";

export type DefinitionListProps = PropsWithChildren<{
	ariaLabel?: string;
}>;

export const DefinitionList: FC<DefinitionListProps> = ({
	ariaLabel,
	children,
}) => {
	return (
		<dl className={styles.definitionList} aria-label={ariaLabel}>
			{children}
		</dl>
	);
};
