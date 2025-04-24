import { FC } from "react";

import { Panel } from "@nice-digital/nds-panel";

import { RelatedList } from "@/feeds/publications/types";

import styles from "./RelatedProducts.module.scss";

export type RelatedProductsProps = {
	relatedProducts?: RelatedList[];
};

export const RelatedProducts: FC<RelatedProductsProps> = ({
	relatedProducts,
}) => {
	return relatedProducts && relatedProducts.length > 0 ? (
		<Panel className={styles.panelRelatedqs}>
			<h5>Related quality standards</h5>
			{relatedProducts.map((item, index) => (
				<>
					<a href={item.url} key={index}>
						{item.title}
					</a>
					{index < relatedProducts.length - 1 && <hr />}
				</>
			))}
		</Panel>
	) : null;
};
