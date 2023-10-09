import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("232422654783055");

export default function MedicinesAndPrescribingNewsletterForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Subscribe to medicines and prescribing alerts"
			lead="Get updates from our medicines and prescribing team."
			parentPages={[
				{
					title: "Newsletters and alerts",
					path: "/news/newsletters-and-alerts",
				},
				{
					title: "News",
					path: "/news",
				},
			]}
			formHeader={
				<>
					<p>This includes:</p>
					<ul>
						<li>new evidence summaries</li>
						<li>medicines and prescribing guidance</li>
						<li>news and updates relating to medicines.</li>
					</ul>
				</>
			}
		/>
	);
}
