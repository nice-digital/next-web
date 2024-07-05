import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("232422293687865");

export default function HealthAndSocialCareNewsletterForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Subscribe to NICE news for health and social care"
			lead="Keeping you up-to-date with important developments."
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
