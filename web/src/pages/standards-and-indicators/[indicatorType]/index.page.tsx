import { GetServerSideProps } from "next/types";

import { getAllIndicatorSubTypes } from "@/feeds/publications/publications";

const oldPathToPublicationsIdentifierPrefixMap = new Map([
	["qofindicators", "GPIQ"],
	["ccgoisindicators", "CCG"],
	["gpqualityimprovements", "GPINQ"],
	["nlindicators", "NLQ"],
]);

export type Params = {
	indicatorType: string;
};

export const getServerSideProps: GetServerSideProps<never, Params> = async ({
	params,
}) => {
	if (!params) return { notFound: true };

	const indicatorTypeIdentifierPrefix =
		oldPathToPublicationsIdentifierPrefixMap.get(
			params.indicatorType.toLowerCase()
		);

	if (!indicatorTypeIdentifierPrefix) return { notFound: true };

	const indicatorSubTypes = await getAllIndicatorSubTypes(),
		subType = indicatorSubTypes.find(
			(s) => s.identifierPrefix === indicatorTypeIdentifierPrefix
		),
		urlParams = new URLSearchParams();

	if (!subType)
		throw Error(
			`Expected to find an indicator sub type with identifier prefix '${indicatorTypeIdentifierPrefix}'`
		);

	urlParams.append("rty", subType.pluralName);

	return {
		redirect: {
			destination: "/indicators/published?" + urlParams.toString(),
			permanent: true,
		},
	};
};

export default function OldIndicatorsFilteredListPage(): void {
	// Default export to prevent next.js errors: we don't need an actual component
	// because the work is done in getServerSideProps to redirect
}
