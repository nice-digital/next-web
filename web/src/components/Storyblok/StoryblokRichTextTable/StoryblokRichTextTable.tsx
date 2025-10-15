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

    const headerCells = useMemo(() => rows[0]?.content || [], [rows]);
    const bodyRows = useMemo(() => rows.slice(1), [rows]);

    const renderHeader = () => (
        <thead data-testid="table-head">
            <tr>
                {headerCells.map((cell, index) => (
                    <th key={index} scope="col" data-align={getAlignment(cell)}>
                        {cell?.content && (
                            <StoryblokRichText
                                content={{ type: "doc", content: cell.content }}
                            />
                        )}
                    </th>
                ))}
            </tr>
        </thead>
    );

    const renderBody = () => (
        <tbody data-testid="table-body">
            {bodyRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {row.content?.map((cell, cellIndex) => (
                        <td key={cellIndex} scope="row" data-align={getAlignment(cell)}>
                            {cell?.content && (
                                <StoryblokRichText
                                    content={{ type: "doc", content: cell.content }}
                                />
                            )}
                        </td>
                    ))}
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
                {summary && (
                    <StoryblokRichText content={summary}/>
                )}
            </caption>
            {renderHeader()}
            {renderBody()}
        </Table>
    );
};