import { FC } from "react";

import { GridItem } from "@nice-digital/nds-grid"; // Assuming GridItem is from this library
import { Panel } from "@nice-digital/nds-panel";

import { RelatedProductList } from "@/feeds/publications/types";

import styles from "./RelatedProducts.module.scss";

export type RelatedProductsProps = {
	relatedProducts?: RelatedProductList[];
};

export const RelatedProducts: FC<RelatedProductsProps> = ({
	relatedProducts,
}) => {
	return relatedProducts && relatedProducts.length > 0 ? (
		<GridItem cols={12} md={4}>
			<Panel className={styles.panelRelatedqs}>
				<h5>Related quality standards</h5>
				{relatedProducts.map((item, index) => (
					<div key={index}>
						<a href={item.url}>{item.title}</a>
						{index < relatedProducts.length - 1 && <hr />}
					</div>
				))}
			</Panel>
		</GridItem>
	) : null;
};
