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
	const { id, title, lastMajorModificationDate, productGroup } = product,
		destination = getProductPath(product);

	const metadata: (CardMetaDataProps | undefined)[] = [
		{ label: "Product type:", value: productGroup },
		productTypeName
			? { label: "Programme:", value: productTypeName }
			: undefined,
		{
			label: "Last updated:",
			visibleLabel: true,
			value: (
				<time dateTime={lastMajorModificationDate}>
					{formatDateStr(lastMajorModificationDate)}
				</time>
			),
		},
	].filter(Boolean);

	return (
		<Card
			headingText={
				<data value={id}>
					{title}&nbsp;({id})
				</data>
			}
			metadata={metadata as CardMetaDataProps[]}
			link={destination ? { destination } : undefined}
		></Card>
	);
};
