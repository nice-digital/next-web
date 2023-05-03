import { type FC } from "react";

import { PageHeader } from "@nice-digital/nds-page-header";

import { ProductDetail } from "@/feeds/publications/types";
import { formatDateStr, stripTime } from "@/utils/datetime";

export type ProductPageHeadingProps = {
	product: Pick<
		ProductDetail,
		| "id"
		| "title"
		| "productTypeName"
		| "publishedDate"
		| "lastMajorModificationDate"
	>;
	children?: never;
};

export const ProductPageHeading: FC<ProductPageHeadingProps> = ({
	product: {
		id,
		lastMajorModificationDate,
		productTypeName,
		publishedDate,
		title,
	},
}) => (
	<PageHeader
		heading={title}
		useAltHeading
		id="content-start"
		metadata={[
			productTypeName,
			id,
			publishedDate ? (
				<>
					Published:
					<time dateTime={stripTime(publishedDate)}>
						&nbsp;{formatDateStr(publishedDate)}
					</time>
				</>
			) : null,
			lastMajorModificationDate != publishedDate ? (
				<>
					Last updated:
					<time dateTime={stripTime(lastMajorModificationDate)}>
						{" "}
						&nbsp;{formatDateStr(lastMajorModificationDate)}
					</time>
				</>
			) : null,
		].filter(Boolean)}
	/>
);
