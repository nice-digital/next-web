import { BadgingFields } from "@/feeds/publications/types";
import { FC } from "react";
import styles from "./Accreditations.module.scss";
import { slugify } from "@/utils/url";

export type AccreditationsProps = {
	accreditationsList: BadgingFields[];
	productId: string;
};

export const Accreditations: FC<AccreditationsProps> = ({
	accreditationsList,
	productId,
}) => {

	return accreditationsList && accreditationsList.length > 0 ? (
		<div className={styles.div}>
			{
				accreditationsList
				.map((item, index) => (
					<span key={index} className={styles.span}>
						<img src={ `/api/indicators/${productId}/accreditation/${slugify(item.name)}`} alt={item.name} className={styles.img} />
					</span>
				))
			}
		</div>
	) : null;
};


