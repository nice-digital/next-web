import { FC } from "react";

import { Card, CardMetaDataProps } from "@nice-digital/nds-card";

import { ProductLite } from "@/feeds/publications/types";
import { formatDateStr, getProductPath } from "@/utils";

export interface ProductCardProps {
	product: ProductLite;
	productTypeName?: string;
}

/**
 * NICE Design System Card component for an in development project
 */
export const ProductCard: FC<ProductCardProps> = ({
	product,
	productTypeName,
}) => {
	const { Id, Title, LastMajorModificationDate, ProductGroup } = product,
		destination = getProductPath(product);

	const metadata: (CardMetaDataProps | undefined)[] = [
		{ label: "Product type:", value: ProductGroup },
		productTypeName
			? { label: "Programme:", value: productTypeName }
			: undefined,
		{
			label: "Last updated:",
			visibleLabel: true,
			value: (
				<time dateTime={LastMajorModificationDate}>
					{formatDateStr(LastMajorModificationDate)}
				</time>
			),
		},
	].filter(Boolean);

	return (
		<Card
			headingText={
				<data value={Id}>
					{Title}&nbsp;({Id})
				</data>
			}
			metadata={metadata as CardMetaDataProps[]}
			link={destination ? { destination } : undefined}
		></Card>
	);
};
