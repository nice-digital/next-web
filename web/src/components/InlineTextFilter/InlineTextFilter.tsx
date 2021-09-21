import React, { FC, ReactNode } from "react";

import { Button } from "@nice-digital/nds-button";
import { Input } from "@nice-digital/nds-input";

import styles from "./InlineTextFilter.module.scss";

interface InlineTextFilterProps {
	label: ReactNode;
	name: string;
	placeholder?: string;
	defaultValue?: string;
}

export const InlineTextFilter: FC<InlineTextFilterProps> = ({
	label,
	name,
	placeholder,
	defaultValue,
}) => (
	<div className={styles.container}>
		<label className={styles.label} htmlFor={name}>
			{label}
		</label>
		<Input
			name={name}
			label={null}
			placeholder={placeholder}
			defaultValue={defaultValue}
			className={styles.input}
			autoComplete="off"
		/>
		<Button className={styles.button} variant="cta" type="submit">
			Search
		</Button>
	</div>
);
