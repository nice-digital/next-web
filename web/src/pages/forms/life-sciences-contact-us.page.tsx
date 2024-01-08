import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("232991221799063");

export default function LifeSciencesContactUsForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Life sciences contact us form"
			lead=""
			parentPages={[
				{
					title: "Life sciences: how to get your product to market",
					path: "/about/what-we-do/life-sciences",
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
