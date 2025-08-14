import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

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
					path: "/what-nice-does/our-guidance/prioritising-our-guidance-topics/our-prioritisation-decisions",
				},
				{
					title: "Prioritising our guidance topics",
					path: "/what-nice-does/our-guidance/prioritising-our-guidance-topics",
				},
				{
					title: "Our guidance",
					path: "/what-nice-does/our-guidance",
				},
				{
					title: "What NICE Does",
					path: "/what-nice-does",
				},
			]}
		/>
	);
}
