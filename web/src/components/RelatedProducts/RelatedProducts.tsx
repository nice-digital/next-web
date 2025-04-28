import { FC } from "react";

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
		<Panel className={styles.panelRelatedqs}>
			<h5>Related quality standards</h5>
			{relatedProducts.map((item, index) => (
				<div key={index}>
					<a href={item.url}>{item.title}</a>
					{index < relatedProducts.length - 1 && <hr />}
				</div>
			))}
		</Panel>
	) : null;
};
