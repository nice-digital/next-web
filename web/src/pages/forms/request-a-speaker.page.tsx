import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("232203800035035");

export default function RequestASpeakerForm(props: FormProps): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Speaker request form"
			lead=""
			parentPages={[
				{
					title: "Events",
					path: "/news/events",
				},
				{
					title: "News",
					path: "/news",
				},
			]}
		/>
	);
}
