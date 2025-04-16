import Image from "next/image";
import { FC } from "react";

import { BadgingFields } from "@/feeds/publications/types";
import { slugify } from "@/utils/url";

import styles from "./LogosList.module.scss";

export type LogosListProps = {
	logosList: BadgingFields[];
	productId: string;
	logoType: string;
};

export const LogosList: FC<LogosListProps> = ({
	logosList,
	productId,
	logoType,
}) => {
	return logosList && logosList.length > 0 ? (
		<div className={styles.div}>
			{logosList.map((item, index) => (
				<span key={index} className={styles.span}>
					<Image
						src={`/api/indicators/${productId}/${logoType}/${slugify(
							item.name
						)}`}
						alt={item.name}
						className={styles.img}
						width={0}
						height={0}
						unoptimized
					/>
				</span>
			))}
		</div>
	) : null;
};
