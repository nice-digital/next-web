import { NextSeo } from "next-seo";
import { FC } from "react";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { JotFormEmbed } from "@/components/JotFormEmbed/JotFormEmbed";

import { FormProps } from "./JotFormPage.getGetServerSideProps";

export type FormPageProps = FormProps & {
	formName: string;
	parentPages: { title: string; path?: string }[];
	lead: string;
};

export const JotFormPage: FC<FormPageProps> = ({
	height,
	formID,
	formName,
	parentPages,
	lead,
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

			<PageHeader heading={formName} lead={lead} id="content-start" />

			<JotFormEmbed jotFormID={formID} title={formName} height={height} />
		</>
	);
};
