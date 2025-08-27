import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("241962582676065");

export default function UseOfNICEContentInternationalForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Permission request form for international use of NICE content"
			lead=""
			parentPages={[
				{
					title: "Reusing our content",
					path: "/reusing-our-content",
				},
			]}
		/>
	);
}
