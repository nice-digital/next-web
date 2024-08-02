import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";

import { Button } from "@nice-digital/nds-button";
import { FilterGroup } from "@nice-digital/nds-filters";
import { Input } from "@nice-digital/nds-input";

import styles from "./InlineTextFilter.module.scss";

interface InlineTextFilterProps {
	label: ReactNode;
	name: string;
	placeholder?: string;
	defaultValue?: string;
	heading?: string;
}

export const InlineTextFilter: FC<InlineTextFilterProps> = ({
	label,
	name,
	placeholder,
	defaultValue,
	heading = "Keyword in title or reference number",
}) => (
	<FilterGroup heading={heading} headingLevel={3}>
		<InlineTextFilterBody
			label={label}
			name={name}
			placeholder={placeholder}
			defaultValue={defaultValue}
		/>
	</FilterGroup>
);

export const InlineTextFilterBody: FC<InlineTextFilterProps> = ({
	label,
	name,
	placeholder,
	defaultValue,
}) => {
	const [value, setValue] = useState(defaultValue || ""),
		onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
			setValue(e.currentTarget.value);
		}, []);

	useEffect(() => {
		setValue(defaultValue || "");
	}, [defaultValue]);

	return (
		<div className="ph--c pt--c">
			<Input
				name={name}
				label=""
				placeholder={placeholder}
				className={styles.input}
				autoComplete="off"
				onChange={onInputChange}
				value={value}
				spellCheck={false}
			/>
			<Button className="ml--0" variant="secondary" type="submit">
				Apply Filter
			</Button>
		</div>
	);
};
