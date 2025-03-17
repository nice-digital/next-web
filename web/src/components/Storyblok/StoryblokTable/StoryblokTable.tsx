import React from "react";

import { Table } from "@nice-digital/nds-table";
import styles from "./StoryblokTable.module.scss";

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
		<Table>
			{(title || summary) && (
				<caption className={styles.table__caption} data-testid="table-caption">
					{title && <h3>{title}</h3>}
					{summary && <p>{summary}</p>}
				</caption>
			)}
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
	);
};
