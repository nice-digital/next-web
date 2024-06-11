import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("232421981351856");

export default function NewsInternationalNewsletterForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Subscribe to NICE news international"
			lead="Keeping you up-to-date with our worldwide collaborations, opportunities and developments."
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
