import React from "react";

import { usePaginationFocus } from "@/hooks/usePaginationFocus";

type PaginationFocusedElementProps = {
	innerText: string;
};

export const PaginationFocusedElement = ({
	innerText,
}: PaginationFocusedElementProps): React.ReactNode => {
	const focusPagination = usePaginationFocus();
	return (
		<h2 className="visually-hidden" tabIndex={-1} ref={focusPagination}>
			{innerText}
		</h2>
	);
};
