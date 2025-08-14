import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("243234023965959");

export default function TopicSuggestionForm(props: FormProps): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Topic suggestion"
			lead=""
			parentPages={[
				{
					title: "What we do",
					path: "/what-nice-does/prioritising-our-guidance-topics",
				},
				{
					title: "What NICE does",
					path: "/what-nice-does",
				}
			]}
		/>
	);
}
