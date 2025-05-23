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
					path: "/about/nice-communities/nice-and-the-public/public-involvement",
				},

				{
					title: "NICE and the public",
					path: "/about/nice-communities/nice-and-the-public",
				},
				{
					title: "NICE Communities",
					path: "/about/nice-communities",
				},
				{
					title: "About",
					path: "/about",
				},
			]}
		/>
	);
}
