import React, { FC } from "react";

import { Input } from "@nice-digital/nds-input";

interface InlineTextFilterProps {
	label: string;
	name: string;
	placeholder?: string;
	onChange: React.ChangeEventHandler;
	defaultValue?: string;
}

export const InlineTextFilter: FC<InlineTextFilterProps> = (props) => {
	return <Input {...props} />;
};
