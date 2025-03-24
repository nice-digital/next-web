import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("241921982281056");

export default function UseOfNICEContentForAIForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Permission to use NICE content for artificial intelligence (AI) purposes"
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
