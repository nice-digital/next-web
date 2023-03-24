import { JotFormPage } from "./JotFormPage";
import {
	type FormProps,
	getGetServerSideProps,
} from "./JotFormPage.getGetServerSideProps";

export const getServerSideProps = getGetServerSideProps("230793530776059");

export default function IPNotificationForm(props: FormProps): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Interventional procedures notification form"
			lead="Tell us about an interventional procedure you think should be assessed by NICE. This can be a new procedure or a review of our existing guidance."
			parentPages={[
				{
					title: "Notify a procedure",
					path: "/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/notify",
				},
				{
					title: "NICE interventional procedures guidance",
					path: "/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance",
				},
				{
					title: "NICE guidance",
					path: "/about/what-we-do/our-programmes/nice-guidance",
				},
				{
					title: "Our programmes",
					path: "/about/what-we-do/our-programmes",
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
