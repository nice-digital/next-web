import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("232203151110028");

export default function HelpImplementNiceGuidanceForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Adoption and impact reference panel membership form"
			lead="Join the NICE Adoption and Impact Reference Panel. Give your advice on tools and resources as they're being developed. Help us shape the commissioning and delivery of safe, effective and cost-efficient care."
			parentPages={[
				{
					title: "Adoption and implementation support",
					path: "/implementing-nice-guidance/implementation-help-and-advice/adoption-and-implementation-support",
				},
				{
					title: "Implementation help and advice",
					path: "/implementing-nice-guidance/implementation-help-and-advice",
				},
				{
					title: "Implementing NICE guidance",
					path: "/implementing-nice-guidance",
				},
			]}
		/>
	);
}
