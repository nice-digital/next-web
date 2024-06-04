import { NextSeo } from "next-seo";
import { FC } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";

import { JotFormEmbed } from "@/components/JotFormEmbed/JotFormEmbed";

import { FormProps } from "./getGetServerSideProps";

export type JotFormPageProps = FormProps & {
	formName: string;
	parentPages: { title: string; path?: string }[];
	lead: string;
	informationPanel?: JSX.Element;
	formHeader?: JSX.Element;
	formFooter?: JSX.Element;
};

export const JotFormPage: FC<JotFormPageProps> = ({
	height,
	formID,
	formName,
	parentPages,
	lead,
	informationPanel,
	formHeader,
	formFooter,
}) => {
	return (
		<>
			<NextSeo
				title={[formName, ...parentPages.map((p) => p.title)].join(" | ")}
				description={lead}
			/>
			<Breadcrumbs>
				{[
					{ title: "Home", path: "/" },
					...parentPages.slice().reverse(),
					{ title: formName },
				].map(({ title, path }) => (
					<Breadcrumb key={title} to={path}>
						{title}
					</Breadcrumb>
				))}
			</Breadcrumbs>
			<Grid gutter="loose">
				<GridItem
					cols={12}
					md={informationPanel ? 8 : 12}
					lg={informationPanel ? 8 : 12}
				>
					<PageHeader heading={formName} lead={lead} id="content-start" />
					{formHeader ? <>{formHeader}</> : null}
					<JotFormEmbed jotFormID={formID} title={formName} height={height} />
					{formFooter ? <>{formFooter}</> : null}
				</GridItem>
				{informationPanel ? (
					<GridItem cols={12} md={4} lg={4}>
						{informationPanel}
					</GridItem>
				) : null}
			</Grid>
		</>
	);
};
