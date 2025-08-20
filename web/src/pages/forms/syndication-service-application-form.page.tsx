import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("241983007673057");

export default function SyndicationServiceApplicationForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Syndication service application form"
			lead=""
			parentPages={[
				{
					title: "NICE syndication API",
					path: "/reusing-our-content/nice-syndication-api",
				},
				{
					title: "Reusing our content",
					path: "/reusing-our-content",
				},
			]}
		/>
	);
}
