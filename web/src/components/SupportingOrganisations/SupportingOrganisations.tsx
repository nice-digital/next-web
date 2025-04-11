import React, { type FC } from "react";

import { BadgingFields } from "@/feeds/publications/types";

export type SupportingOrganisationsProps = {
	supportingList: BadgingFields[];
	productTypeName: string;
};

export const SupportingOrganisations: FC<SupportingOrganisationsProps> = ({
	supportingList,
	productTypeName,
}) => {
	return supportingList && supportingList.length > 0 ? (
		<div>
			<h4>Supporting organisations</h4>
			<p>A number of organisations recognise the benefit of this {productTypeName} in improving care. They work with us to promote it to commissioners and service providers:</p>
			<ul>
				{
					supportingList
					.slice()
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((item, index) => (
						<li key={index}>
							<a href={item.url}>{item.name}</a>
						</li>
					))
				}
			</ul>
		</div>
	) : null;
};
