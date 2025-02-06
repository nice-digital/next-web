import { NextSeo } from "next-seo";

import { Breadcrumb, Breadcrumbs } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { PageHeader } from "@nice-digital/nds-page-header";

import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("232421834202848");

export default function MedicinesAndPrescribingNewsletterForm(
	props: FormProps
): JSX.Element {
	//TODO leaving the jotformpage in case they want to republish the form later
	// return (
	// 	// <JotFormPage
	// 	// 	{...props}
	// 	// 	formName="Subscribe to medicines and prescribing - Important new evidence"
	// 	// 	lead="Receive monthly updates on prescribing and medicines optimisation. Includes information from national bodies including NICE, SIGN and the MHRA."
	// 	// 	parentPages={[
	// 	// 		{
	// 	// 			title: "Newsletters and alerts",
	// 	// 			path: "/nice-newsletters-and-alerts",
	// 	// 		},
	// 	// 		{
	// 	// 			title: "News",
	// 	// 			path: "/news",
	// 	// 		},
	// 	// 	]}
	// 	// />
	// );

	return (
		<>
			<NextSeo title="Medicines and prescribing - important new evidence | Newsletters and alerts | News" />

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/news">News</Breadcrumb>
				<Breadcrumb to="/nice-newsletters-and-alerts">
					Newsletters and alerts
				</Breadcrumb>
				<Breadcrumb>
					Medicines and prescribing - important new evidence
				</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				heading="Medicines and prescribing - important new evidence"
				lead="We no longer publish the medicines and prescribing - important new evidence newsletter."
				// lead="some lead text"
				id="content-start"
				verticalPadding="loose"
			/>
			<h2>What can I do now?</h2>
			<p>
				Please visit our main{" "}
				<a href="/nice-newsletters-and-alerts">NICE newsletters and alerts</a>{" "}
				page to subscribe to other resources, including the{" "}
				<a href="https://nice.us8.list-manage.com/subscribe?u=7864f766b10b8edd18f19aa56&id=ea7a83a510">
					medicines awareness service
				</a>{" "}
				and{" "}
				<a href="https://www.nice.org.uk/forms/subscribe-to-medicine-and-prescribing-alerts">
					medicines and prescribing alerts
				</a>{" "}
				bulletins.
			</p>
		</>
	);
}
