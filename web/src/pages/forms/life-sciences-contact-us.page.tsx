import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("232991221799063");

const FormHeader = () => (
	<p>
		If your enquiry relates to other parts of NICE, please contact our general
		enquiries team on <a href="mailto:nice@nice.org.uk">nice@nice.org.uk</a>
	</p>
);

export default function LifeSciencesContactUsForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Life sciences contact us form"
			lead="This enquiry form is designed to help developers of pharmaceuticals and healthtech products access NICE Advice support services."
			parentPages={[
				{
					title: "Life sciences: how to get your product to market",
					path: "/about/what-we-do/life-sciences",
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
			formHeader={<FormHeader />}
		/>
	);
}
