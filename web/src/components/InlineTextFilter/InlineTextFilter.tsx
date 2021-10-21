import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";

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
}) => {
	const [value, setValue] = useState(defaultValue),
		onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
			setValue(e.currentTarget.value);
		}, []);

	useEffect(() => {
		setValue(defaultValue);
	}, [defaultValue]);

	return (
		<div className={styles.container}>
			<label className={styles.label} htmlFor={name}>
				{label}
			</label>
			<Input
				name={name}
				label={null}
				placeholder={placeholder}
				className={styles.input}
				autoComplete="off"
				onChange={onInputChange}
				value={value}
			/>
			<Button className={styles.button} variant="primary" type="submit">
				Filter
			</Button>
		</div>
	);
};
