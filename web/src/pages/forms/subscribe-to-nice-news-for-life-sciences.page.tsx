import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("232422198305856");

export default function LifeSciencesNewsletterForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Subscribe to NICE news for life sciences"
			lead="Keeping those working within the life sciences sector up-to-date with important developments."
			parentPages={[
				{
					title: "NICE newsletters and alerts",
					path: "/nice-newsletters-and-alerts",
				},
			]}
		/>
	);
}
