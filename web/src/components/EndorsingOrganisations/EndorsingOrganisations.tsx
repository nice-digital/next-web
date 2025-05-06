import React, { type FC } from "react";

import { BadgingFields } from "@/feeds/publications/types";

export type EndorsingOrganisationsProps = {
	endorsingList: BadgingFields[];
	productTypeName: string;
};

export const EndorsingOrganisations: FC<EndorsingOrganisationsProps> = ({
	endorsingList,
	productTypeName,
}) => {
	return endorsingList && endorsingList.length > 0 ? (
		<div>
			<h4>Endorsing bodies</h4>
			<p>
				This {productTypeName} is endorsed by
				{endorsingList.map((item, index) => (
					<span key={index}>
						{index > 0 && " and "}
						<a href={item.url}>{item.name}</a>
					</span>
				))}
				{" as required by the Health and Social Care Act (2012)."}
			</p>
		</div>
	) : null;
};
