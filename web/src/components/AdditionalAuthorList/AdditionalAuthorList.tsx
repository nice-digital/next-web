import { BadgingFields } from "@/feeds/publications/types";
import { FC } from "react";
import styles from "./AdditionalAuthorList.module.scss";
import { slugify } from "@/utils/url";

export type AdditionalAuthorListProps = {
	authorList: BadgingFields[];
	productId: string;
};

export const AdditionalAuthorList: FC<AdditionalAuthorListProps> = ({
	authorList,
	productId,
}) => {

	return authorList && authorList.length > 0 ? (
		<div className={styles.div}>
			{
				authorList
				.map((item, index) => (
					<span key={index} className={styles.span}>
						<img src={ `/api/indicators/${productId}/author/${slugify(item.name)}`} alt={item.name} className={styles.img} />
					</span>
				))
			}
		</div>
	) : null;
};


