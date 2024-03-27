import { useRouter } from "next/router";
import { useRef, useEffect } from "react";

export const usePaginationFocus = (): React.RefObject<HTMLHeadingElement> => {
	const { query } = useRouter();
	const focusPagination = useRef<HTMLHeadingElement>(null);
	useEffect(() => {
		if (query && query.page && focusPagination.current) {
			console.log(query.page);
			focusPagination.current.focus();
		}
	}, [query]);

	return focusPagination;
};
