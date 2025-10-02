import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("232421799357869");

export default function PrimaryCareNewsletterForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Subscribe to update for Primary Care"
			lead="Keeping GPs and others working in primary care up-to-date with important developments."
			parentPages={[
				{
					title: "NICE newsletters and alerts",
					path: "/nice-newsletters-and-alerts",
				},
			]}
		/>
	);
}
