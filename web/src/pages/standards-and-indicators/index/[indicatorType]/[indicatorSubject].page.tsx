import { type GetServerSideProps } from "next/types";

import { getAllIndicatorSubTypes } from "@/feeds/publications/publications";

const oldPathToPublicationsIdentifierPrefixMap = new Map([
	["qof", "GPIQ"],
	["ccg", "CCG"],
	["gpqualityimprovement", "GPINQ"],
	["nationallibrary", "NLQ"],
]);

export type Params = {
	indicatorType: string;
	indicatorSubject: string;
};

export const getServerSideProps: GetServerSideProps<
	Record<string, never>,
	Params
> = async ({ params }) => {
	if (!params?.indicatorType || !params?.indicatorSubject)
		return { notFound: true };

	const urlParams = new URLSearchParams();

	const indicatorTypeIdentifierPrefix =
		oldPathToPublicationsIdentifierPrefixMap.get(
			params.indicatorType.toLowerCase()
		);

	if (indicatorTypeIdentifierPrefix) {
		const indicatorSubTypes = await getAllIndicatorSubTypes();

		const subType = indicatorSubTypes.find(
			(s) => s.identifierPrefix === indicatorTypeIdentifierPrefix
		);

		if (!subType)
			throw Error(
				`Expected to find an indicator sub type with identifier prefix ${indicatorTypeIdentifierPrefix}`
			);

		urlParams.append("rty", subType.pluralName);
	}

	if (params.indicatorSubject.toLowerCase() !== "all") {
		urlParams.append("sub", params.indicatorSubject);
	}

	return {
		redirect: {
			destination: "/indicators/published?" + urlParams.toString(),
			permanent: true,
		},
	};
};

export default function OldIndicatorListPageFiltered(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to redirect
}
