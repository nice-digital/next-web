import { FC } from "react";

import { Button } from "@nice-digital/nds-button";
import { Grid, GridItem } from "@nice-digital/nds-grid";

import { formatDateStr, stripTime } from "@/utils/datetime";
import { ConvertedDocumentPrevNext } from "@/components/ConvertedDocumentPrevNext/ConvertedDocumentPrevNext";
import { ConvertedDocumentChapterMenu } from "@/components/ConvertedDocumentChapterMenu/ConvertedDocumentChapterMenu";
import { OnThisPageBasic } from "@/components/OnThisPageBasic/OnThisPageBasic";
import { niceIndevConvertedDocumentChapter, niceIndevConvertedDocumentSection } from "@/feeds/inDev/inDev";

import styles from "./ConvertedDocument.module.scss";

export type ConvertedDocumentProps = {
	lastUpdated: string;
	resource: {
		chapters: niceIndevConvertedDocumentChapter[];
		htmlBody: string;
		isConvertedDocument: boolean;
		pdfDownloadLink: string | null;
		sections?: niceIndevConvertedDocumentSection[];
		title: string;
	};
};

export const ConvertedDocument: FC<ConvertedDocumentProps> = ({
	resource,
	lastUpdated,
}) => {
	const { chapters, htmlBody, pdfDownloadLink, sections, title } = resource;

	const hasChapters = chapters.length > 0,
		hasDownloadButton = !!pdfDownloadLink,
		hasOnThisPageMenu = !!sections;

	return (
		<>
			<Grid gutter="loose">
				{hasChapters || hasDownloadButton ? (
					<GridItem
						cols={12}
						md={4}
						lg={3}
						elementType="section"
						aria-label="Chapters"
					>
						{hasDownloadButton ? (
							<Button
								aria-label="Download PDF"
								className={styles.download}
								target="_blank"
								to={pdfDownloadLink}
								variant="cta"
							>
								Download (PDF)
							</Button>
						) : null}

						{hasChapters ? (
							<ConvertedDocumentChapterMenu ariaLabel="chapters" chapters={chapters} />
						) : null}
					</GridItem>
				) : null}

				<GridItem
					cols={12}
					md={hasChapters || hasDownloadButton ? 8 : 12}
					lg={hasChapters || hasDownloadButton ? 9 : 12}
					elementType="section"
				>
					<h2 className="mt--0">{title}</h2>

					{hasOnThisPageMenu ? (
						<div className="hide-print">
							<OnThisPageBasic sections={sections} />
						</div>
					) : null}

					<div
						dangerouslySetInnerHTML={{ __html: htmlBody }}
						className={styles.chapterContent}
					/>

					{lastUpdated ? (
						<p>
							This page was last updated on{" "}
							<time dateTime={stripTime(lastUpdated)}>
								{formatDateStr(lastUpdated)}
							</time>
						</p>
					) : null}

					<ConvertedDocumentPrevNext chapters={chapters} />
				</GridItem>
			</Grid>
		</>
	);
};
