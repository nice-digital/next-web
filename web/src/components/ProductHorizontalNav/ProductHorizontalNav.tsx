import { useRouter } from "next/router";
import { type FC } from "react";

import {
	HorizontalNav,
	HorizontalNavLink,
} from "@nice-digital/nds-horizontal-nav";

import { ScrollToContentStartLink } from "../Link/Link";

export type ProductHorizontalNavProps = {
	/** The nav label for the product overview eg "Quality standard", "Guidance", "Advice" or "indicator" etc */
	productTypeName: string;
	productPath: string;
	hasEvidenceResources: boolean;
	hasInfoForPublicResources: boolean;
	hasToolsAndResources: boolean;
	hasHistory: boolean;
};

export const ProductHorizontalNav: FC<ProductHorizontalNavProps> = ({
	productTypeName,
	productPath,
	hasEvidenceResources,
	hasInfoForPublicResources,
	hasToolsAndResources,
	hasHistory,
}) => {
	const { asPath } = useRouter(),
		path = asPath.replace(/#.*/, ""),
		toolsAndResourcesPath = `${productPath}/resources`,
		isUnderResources = path.indexOf(toolsAndResourcesPath) === 0,
		ifpPath = `${productPath}/information-for-the-public`,
		isUnderIFP = path.indexOf(ifpPath) === 0,
		evidencePath = `${productPath}/evidence`,
		isUnderEvidence = path.indexOf(evidencePath) === 0,
		historyPath = `${productPath}/history`,
		isUnderHistory = path.indexOf(historyPath) === 0;

	// Some product types e.g. corporate or process don't have any resources or history,
	// and therefore don't need a nav at all
	if (
		!hasEvidenceResources &&
		!hasInfoForPublicResources &&
		!hasToolsAndResources &&
		!hasHistory
	)
		return null;

	return (
		<HorizontalNav>
			<HorizontalNavLink
				destination={productPath}
				elementType={ScrollToContentStartLink}
				isCurrent={
					!isUnderResources &&
					!isUnderIFP &&
					!isUnderEvidence &&
					!isUnderHistory
				}
			>
				{productTypeName}
			</HorizontalNavLink>
			{hasToolsAndResources ? (
				<HorizontalNavLink
					destination={toolsAndResourcesPath}
					elementType={ScrollToContentStartLink}
					isCurrent={isUnderResources}
				>
					Tools and resources
				</HorizontalNavLink>
			) : null}
			{/* {hasInfoForPublicResources ? (
				<HorizontalNavLink
					destination={ifpPath}
					elementType={ScrollToContentStartLink}
					isCurrent={isUnderIFP}
				>
					Information for the public
				</HorizontalNavLink>
			) : null} */}
			{hasEvidenceResources ? (
				<HorizontalNavLink
					destination={evidencePath}
					elementType={ScrollToContentStartLink}
					isCurrent={isUnderEvidence}
				>
					Evidence
				</HorizontalNavLink>
			) : null}
			{hasHistory ? (
				<HorizontalNavLink
					destination={historyPath}
					elementType={ScrollToContentStartLink}
					isCurrent={isUnderHistory}
				>
					History
				</HorizontalNavLink>
			) : null}
		</HorizontalNav>
	);
};
