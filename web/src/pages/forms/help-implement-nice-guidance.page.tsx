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
					title: "Into practice",
					path: "/about/what-we-do/into-practice",
				},
				{
					title: "What we do",
					path: "/about/what-we-do",
				},
				{
					title: "About",
					path: "/about",
				},
			]}
		/>
	);
}
