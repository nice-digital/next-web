import React, { useMemo } from "react";
import { Table } from "@nice-digital/nds-table";

import { RichtextStoryblok } from "@/types/storyblok";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";

import styles from "./StoryblokRichTextTable.module.scss";

interface StoryblokRichTextTableProps {
	blok: {
		heading: string;
		headingLevel: number | string;
		summary?: RichtextStoryblok;
		tableContent: {
			content?: RichtextStoryblok[];
		};
	};
}

export const StoryblokRichTextTable: React.FC<StoryblokRichTextTableProps> = ({
	blok,
}) => {
	const { tableContent, heading, headingLevel, summary } = blok;

	const HeadingElement = `h${headingLevel || 2}` as keyof JSX.IntrinsicElements;

	const table = tableContent?.content?.[0];
	const rows = useMemo(() => table?.content || [], [table]);

	if (!rows.length) return null;

	const firstRow = rows[0];

	const isFirstRowHeader = firstRow?.content?.every(
		(cell) => cell.type === "tableHeader"
	);
	const isFirstColumnHeader = rows.every((row) => row.content?.[0]?.type === "tableHeader");

	const bodyRows = isFirstRowHeader ? rows.slice(1) : rows;

	const getAlignment = (cell: RichtextStoryblok) => {
		const paragraph = cell?.content?.[0];
		return paragraph?.attrs?.textAlign || "left";
	};

	const renderCell = (
		cell: RichtextStoryblok,
		cellIndex: number,
		scope?: "row" | "col"
	) => {
		const align = getAlignment(cell);
		const CellTag = cell.type === "tableHeader" ? "th" : "td";

		return (
			<CellTag key={cellIndex} scope={scope} data-align={align}>
				{cell?.content && (
					<StoryblokRichText
						content={{ type: "doc", content: cell.content }}
						className={cell.type === "tableHeader" ? styles.table__tableHeader : undefined}
					/>
				)}
			</CellTag>
		);
	};

	const renderHeader = () => {
		if (!isFirstRowHeader) return null;

		return (
			<thead data-testid="table-head">
				<tr>
					{firstRow.content?.map((cell, index) =>
						renderCell(cell, index, "col")
					)}
				</tr>
			</thead>
		);
	};

	const renderBody = () => (
		<tbody data-testid="table-body">
			{!isFirstRowHeader && firstRow && (
				<tr>
					{firstRow.content?.map((cell, index) => {
						const isRowHeader = index === 0 && isFirstColumnHeader;
						return renderCell(cell, index, isRowHeader ? "row" : undefined);
					})}
				</tr>
			)}

			{bodyRows.map((row, rowIndex) => (
				<tr key={rowIndex}>
					{row.content?.map((cell, cellIndex) => {
						const isRowHeader = cellIndex === 0 && isFirstColumnHeader;
						return renderCell(cell, cellIndex, isRowHeader ? "row" : undefined);
					})}
				</tr>
			))}
		</tbody>
	);

	return (
		<Table
			data-testid="storyblok-table"
			data-tracking="storyblok-table"
			data-component="storyblok-table"
			className={styles.table}
		>
			<caption className={styles.table__caption} data-testid="table-caption">
				<HeadingElement data-testid="table-heading">{heading}</HeadingElement>
				{summary && <StoryblokRichText content={summary} />}
			</caption>

			{renderHeader()}
			{renderBody()}
		</Table>
	);
};
