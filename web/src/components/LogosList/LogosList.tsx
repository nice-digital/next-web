import Image from "next/image";
import { FC } from "react";

import { Grid, GridItem } from "@nice-digital/nds-grid";

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
		<Grid elementType={"ul"}>
			{logosList.map((item, index) => (
				<GridItem key={index} elementType={"li"} cols={6} lg={4}>
					<Image
						src={`/api/indicators/${productId}/${logoType}/${slugify(
							item.name
						)}`}
						alt={item.name}
						className={styles.logo}
						width={0}
						height={0}
						unoptimized
					/>
				</GridItem>
			))}
		</Grid>
	) : null;
};
