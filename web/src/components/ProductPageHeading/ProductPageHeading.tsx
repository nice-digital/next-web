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
	> &
		Partial<Pick<ProductDetail, "terminatedDate">>;
	children?: never;
};

export const ProductPageHeading: FC<ProductPageHeadingProps> = ({
	product: {
		id,
		lastMajorModificationDate,
		productTypeName,
		publishedDate,
		terminatedDate,
		title,
	},
}) => {
	const dateArray = [];

	if (terminatedDate) {
		dateArray.push(
			<>
				Terminated:
				<time dateTime={stripTime(terminatedDate)}>
					&nbsp;{formatDateStr(terminatedDate)}
				</time>
			</>
		);
	} else {
		if (publishedDate) {
			dateArray.push(
				<>
					Published:
					<time dateTime={stripTime(publishedDate)}>
						&nbsp;{formatDateStr(publishedDate)}
					</time>
				</>
			);
		}

		if (lastMajorModificationDate != publishedDate) {
			dateArray.push(
				<>
					Last updated:
					<time dateTime={stripTime(lastMajorModificationDate)}>
						{" "}
						&nbsp;{formatDateStr(lastMajorModificationDate)}
					</time>
				</>
			);
		}
	}

	return (
		<PageHeader
			heading={title}
			useAltHeading
			id="content-start"
			metadata={[productTypeName, id, ...dateArray].filter(Boolean)}
		/>
	);
};
