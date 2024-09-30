import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

import styles from "./forms.module.scss";

export const getServerSideProps = getGetServerSideProps("241421739450049");

export default function RequestForPrioritisationClarificationForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Request for prioritisation clarification"
			lead=""
			parentPages={[
				{
					title: "Our prioritisation decisions",
					path: "/about/what-we-do/prioritising-our-guidance-topics/our-prioritisation-decisions",
				},
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
