import React, { FC } from "react";

import { Button } from "@nice-digital/nds-button";
import { Input } from "@nice-digital/nds-input";

import styles from "./InlineTextFilter.module.scss";

interface InlineTextFilterProps {
	label: string;
	name: string;
	placeholder?: string;
	defaultValue?: string;
}

export const InlineTextFilter: FC<InlineTextFilterProps> = (props) => {
	return (
		<div className={styles.container}>
			<label className={styles.label} htmlFor="q">
				Search by title
			</label>
			<Input {...props} label={null} className={styles.input} />
			<Button className={styles.button} variant="cta" type="submit">
				Search
			</Button>
		</div>
	);
};
