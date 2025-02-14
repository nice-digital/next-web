import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("241971910941055");

const FormHeader = () => {
	return (
		<>
			<p>
				To enable us to process your request as quickly as possible and provide
				a quote, it is important that you supply us with all the relevant
				information.
			</p>
			<p>
				We aim to respond within 7 working days. If you have an urgent deadline,
				please let us know and we will do our best to accommodate this though it
				may not always be possible due to the high volume of requests we
				receive.
			</p>
			<p>
				If your publication, product or service is for use outside of the United
				Kingdom, NICE will provide a content assurance service as part of the
				permissions process to use our content.
			</p>
		</>
	);
};

export default function NiceContentAssuranceServiceForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="NICE content assurance service form"
			lead=""
			parentPages={[
				{
					title: "Content assurance service",
					path: "/re-using-our-content/content-assurance-service",
				},
				{
					title: "Reusing our content",
					path: "/re-using-our-content",
				},
			]}
			formHeader={<FormHeader />}
		/>
	);
}
