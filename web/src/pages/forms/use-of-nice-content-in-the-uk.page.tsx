import { JotFormPage } from "./JotFormPage";
import {
	type FormProps,
	getGetServerSideProps,
} from "./JotFormPage.getGetServerSideProps";

export const getServerSideProps = getGetServerSideProps("223412731228044");

export default function UseOfNICEContentInTheUKForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Use of NICE content in the UK form"
			lead=""
			parentPages={[
				{
					title: "Reusing our content",
					path: "/re-using-our-content",
				},
			]}
		/>
	);
}
