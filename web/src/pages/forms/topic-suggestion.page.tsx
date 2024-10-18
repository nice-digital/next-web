import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

import styles from "./forms.module.scss";

export const getServerSideProps = getGetServerSideProps("241421977936062");

export default function TopicSuggestionForm(props: FormProps): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Topic suggestion"
			lead=""
			parentPages={[
				{
					title: "Prioritising our guidance topics",
					path: "/about/what-we-do/prioritising-our-guidance-topics",
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