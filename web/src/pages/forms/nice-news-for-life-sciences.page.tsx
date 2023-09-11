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
			formName="Website feedback form"
			lead="Thank you for taking a look at our website, we'd like to hear your views."
			parentPages={[
				{
					title: "About",
					path: "/about",
				},
			]}
		/>
	);
}
