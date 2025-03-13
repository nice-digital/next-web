import React from "react";

import { Table } from "@nice-digital/nds-table";

interface TableCol {
	_uid: string;
	value: string;
	component: string;
}

interface TableRow {
	_uid: string;
	body: TableCol[];
	component: string;
}

interface StoryblokTableProps {
	blok: {
		_uid: string;
		table: {
			thead: TableCol[];
			tbody: TableRow[];
		};
		title?: string;
		summary?: string;
		_editable?: string;
		[key: string]: unknown;
	};
}

export const StoryblokTable: React.FC<StoryblokTableProps> = ({ blok }) => {
	const { table, title, summary } = blok;

	if (!table || !table.thead?.length || !table.tbody?.length) {
		return null;
	}

	const { thead = [], tbody = [] } = table;

	return (
		<figure
			data-testid="storyblok-table"
			data-tracking="storyblok-table"
			data-component="storyblok-table"
			aria-describedby={summary ? "table-summary" : undefined}
		>
			{(title || summary) && (
				<figcaption data-testid="table-caption">
					{summary && (
						<p
							id="table-summary"
							className="visually-hidden"
							data-testid="table-summary"
						>
							{summary}
						</p>
					)}
					{title && <span className="visually-hidden">{title}</span>}
				</figcaption>
			)}

			<Table>
				<thead data-testid="table-head">
					<tr>
						{thead.map((cell) => (
							<th
								key={cell._uid}
								scope="col"
								data-testid={`table-header-${cell._uid}`}
							>
								{cell.value}
							</th>
						))}
					</tr>
				</thead>

				<tbody data-testid="table-body">
					{tbody.map((row) => (
						<tr key={row._uid} data-testid={`table-row-${row._uid}`}>
							{row.body.map((cell) => (
								<td key={cell._uid} data-testid={`table-cell-${cell._uid}`}>
									{cell.value}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</Table>
		</figure>
	);
};
