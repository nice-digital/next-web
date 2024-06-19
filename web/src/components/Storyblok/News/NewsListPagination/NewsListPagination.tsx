import { useRouter } from "next/router";
import React from "react";

import { SimplePagination } from "@nice-digital/nds-simple-pagination";

import { Link } from "@/components/Link/Link";

type NewsListPaginationProps = {
	configuration: {
		currentPage: number;
		total: number;
		perPage: number;
	};
};

export const NewsListPagination = ({
	configuration: { currentPage, total, perPage },
}: NewsListPaginationProps): React.ReactElement | null => {
	const router = useRouter();
	const { pathname, query } = router;
	const totalPages = Math.ceil(total / perPage);

	const buildQueryString = (page: number): string => {
		const queryParams = {
			...query,
			page: String(page),
		};
		const queryString = new URLSearchParams(queryParams).toString();
		return queryString ? `?${queryString}` : "";
	};

	if (total === 0) return null;

	return (
		<SimplePagination
			totalPages={totalPages}
			currentPage={currentPage}
			nextPageLink={
				currentPage < totalPages
					? {
							destination: `${pathname}${buildQueryString(currentPage + 1)}`,
							elementType: Link,
					  }
					: undefined
			}
			previousPageLink={
				currentPage > 1
					? {
							destination: `${pathname}${buildQueryString(currentPage - 1)}`,
							elementType: Link,
					  }
					: undefined
			}
		/>
	);
};
