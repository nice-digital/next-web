import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("232421834202848");

export default function MedicinesAndPrescribingNewsletterForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Subscribe to medicines and prescribing - Important new evidence"
			lead="Receive monthly updates on prescribing and medicines optimisation. Includes information from national bodies including NICE, SIGN and the MHRA."
			parentPages={[
				{
					title: "Newsletters and alerts",
					path: "/nice-newsletters-and-alerts",
				},
				{
					title: "News",
					path: "/news",
				},
			]}
		/>
	);
}
