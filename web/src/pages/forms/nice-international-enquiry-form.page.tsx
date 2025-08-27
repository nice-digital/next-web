import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("251406008775355");

export default function InternationalEnquiryForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="NICE International enquiry"
			lead="Thank you for contacting the NICE International team. We will use the information you provide below to understand your enquiry and contact you about your requirements."
			parentPages={[
				{
					title: "NICE International",
					path: "/what-nice-does/nice-international",
				},
				{
					title: "What NICE does",
					path: "/what-nice-does",
				},
			]}
		/>
	);
}
