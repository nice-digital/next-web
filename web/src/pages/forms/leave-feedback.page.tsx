import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("222773673466870");

export default function LeaveFeedbackForm(props: FormProps): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Leave feedback form"
			lead="Thank you for taking a look at our website, we'd like to hear your views. This form is only for website feedback, for all other enquiries please contact us"
			parentPages={[
				{
					title: "Leave feedback",
					path: "/leave-feedback",
				},
			]}
		/>
	);
}
