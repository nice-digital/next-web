import React, { useMemo } from "react";
import { Table } from "@nice-digital/nds-table";

import styles from "./StoryblokRichTextTable.module.scss";
import { StoryblokRichText } from "../StoryblokRichText/StoryblokRichText";
import { RichtextStoryblok } from "@/types/storyblok";

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

	const HeadingElement = `h${headingLevel || 3}` as keyof JSX.IntrinsicElements;
	const table = tableContent?.content?.[0];
	const rows = table?.content || [];

	if (!rows.length) return null;

	const getAlignment = (cell: RichtextStoryblok) => {
		const paragraph = cell?.content?.[0];
		return paragraph?.attrs?.textAlign || "left";
	};
	const isHeaderCell = (cell: RichtextStoryblok) => {
		const paragraph = cell?.content?.[0];
		const firstTextNode = paragraph?.content?.[0];
		return firstTextNode?.marks?.some((mark) => mark.type === "bold");
	};

	const renderCells = (
		cell: RichtextStoryblok,
		cellIndex: number,
		cellType: string
	) => {
		const align = getAlignment(cell);
		const CellTag = isHeaderCell(cell) ? "th" : "td";
		const scope = isHeaderCell(cell) ? cellType : undefined;

		return (
			<CellTag key={cellIndex} scope={scope} data-align={align}>
				{cell?.content && (
					<StoryblokRichText content={{ type: "doc", content: cell.content }} />
				)}
			</CellTag>
		);
	};
	const headerCells = useMemo(() => rows[0]?.content || [], [rows]);
	const bodyRows = useMemo(() => rows.slice(1), [rows]);
	const renderHeader = () => (
		<thead data-testid="table-head">
			<tr>
				{headerCells?.map((cell, cellIndex) =>
					renderCells(cell, cellIndex, "col")
				)}
			</tr>
		</thead>
	);

	const renderBody = () => (
		<tbody data-testid="table-body">
			{bodyRows.map((row, rowIndex) => (
				<tr key={rowIndex}>
					{row.content?.map((cell, cellIndex) =>
						renderCells(cell, cellIndex, "row")
					)}
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
