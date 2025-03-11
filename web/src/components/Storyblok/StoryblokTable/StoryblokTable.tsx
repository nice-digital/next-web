import React, { Suspense } from "react";

import { Table } from "@nice-digital/nds-table";

export const StoryblokTable: React.FC<any> = ({ blok, key }: any) => {
	const { table } = blok;
	const { thead, tbody } = table;
	console.log("thead", table.tbody);

	return (
		<div>
			<Table>
				<thead>
					<tr>
						{thead.map((item: any) => (
							<th key={item._uid}>{item.value}</th>
						))}
					</tr>
				</thead>
				{tbody && (
					<tbody>
						{tbody.map((item: any) => (
							<tr key={item._uid}>{item.value}</tr>
						))}
					</tbody>
				)}
			</Table>
		</div>
	);
};
