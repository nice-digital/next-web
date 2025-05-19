import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("251353686585064");

export default function InternationalEnquiryForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="NICE International enquiry form"
			lead="Thank you for contacting the NICE International team. We will use the information you provide below to understand your enquiry and contact you about your requirements."
			parentPages={[
				{
					title: "About NICE International",
					path: "/about/what-we-do/nice-international/about-nice-international",
				},
				{
					title: "NICE International",
					path: "/about/what-we-do/nice-international",
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
