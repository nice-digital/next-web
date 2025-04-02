import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("242762670883062");

const FormHeader = () => {
	return (
		<>
			<p>All fields marked with * are required and must be filled.</p>
		</>
	);
};

export default function HealthTechnologyAssessmentTrainingRegistrationForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="NICE Health Technology Assessment training registration"
			lead=""
			parentPages={[
				{
					title: "NICE Health Technology Assessment training programme",
					path: "/get-involved/nice-training-and-development-opportunities/nice-health-technology-assessment-training-programme",
				},
				{
					title: "NICE training and development opportunities",
					path: "/get-involved/nice-training-and-development-opportunities",
				},
				{
					title: "Get involved",
					path: "/get-involved",
				},
			]}
			formHeader={<FormHeader />}
		/>
	);
}
