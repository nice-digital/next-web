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
	const { pathname } = useRouter(),
		path = pathname.replace(/#.*/, ""),
		toolsAndResourcesPath = `${productPath}/resources`,
		ifpPath = `${productPath}/informationforpublic`,
		evidencePath = `${productPath}/evidence`,
		historyPath = `${productPath}/history`;

	// Some product types e.g. corporate don't have any resources, and therefore doesn't need a nav at all
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
				isCurrent={path === productPath}
			>
				{productTypeName}
			</HorizontalNavLink>
			{hasToolsAndResources ? (
				<HorizontalNavLink
					destination={toolsAndResourcesPath}
					elementType={ScrollToContentStartLink}
					isCurrent={path.indexOf(toolsAndResourcesPath) === 0}
				>
					Tools and resources
				</HorizontalNavLink>
			) : null}
			{hasInfoForPublicResources ? (
				<HorizontalNavLink
					destination={ifpPath}
					elementType={ScrollToContentStartLink}
					isCurrent={path.indexOf(ifpPath) === 0}
				>
					Information for the public
				</HorizontalNavLink>
			) : null}
			{hasEvidenceResources ? (
				<HorizontalNavLink
					destination={evidencePath}
					elementType={ScrollToContentStartLink}
					isCurrent={path.indexOf(evidencePath) === 0}
				>
					Evidence
				</HorizontalNavLink>
			) : null}
			{hasHistory ? (
				<HorizontalNavLink
					destination={historyPath}
					elementType={ScrollToContentStartLink}
					isCurrent={path.indexOf(historyPath) === 0}
				>
					History
				</HorizontalNavLink>
			) : null}
		</HorizontalNav>
	);
};
