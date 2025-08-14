import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("232600610579048");

export default function PublicInvolvementForm(props: FormProps): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="People and communities network application"
			lead=""
			parentPages={[
				{
					title:
						"People and communities - putting you at the heart of our work",
					path: "/get-involved/people-and-communities",
				},
				{
					title: "Get involved",
					path: "/get-involved",
				}
			]}
		/>
	);
}
