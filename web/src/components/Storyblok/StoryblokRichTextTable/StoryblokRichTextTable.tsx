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
	const headerCells = useMemo(() => rows[0]?.content || [], [rows]);
	const bodyRows = useMemo(() => rows.slice(1), [rows]);
	if (!rows.length) return null;
	const getAlignment = (cell: RichtextStoryblok) => {
		const paragraph = cell?.content?.[0];
		return paragraph?.attrs?.textAlign || "left";
	};
	const addBoldMarkToHeader = (cell: RichtextStoryblok) => {
		if (cell.type !== "tableHeader") return cell;

		const textNode = cell.content?.[0]?.content?.[0];
		if (textNode?.type === "text") {
			textNode.marks = [{ type: "bold" }];
		}

		return cell;
	};

	const renderCells = (
		cell: RichtextStoryblok,
		cellIndex: number,
		cellType: string
	) => {
		const align = getAlignment(cell);
		const CellTag = cell.type === "tableHeader" ? "th" : "td";
		const scope = cell.type === "tableHeader" ? cellType : undefined;
		const richTextData = addBoldMarkToHeader(cell);
		return (
			<CellTag key={cellIndex} scope={scope} data-align={align}>
				{richTextData?.content && (
					<StoryblokRichText
						content={{ type: "doc", content: richTextData.content }}
					/>
				)}
			</CellTag>
		);
	};

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
