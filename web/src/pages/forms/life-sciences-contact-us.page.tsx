import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";
import { Link } from "@/components/Link/Link";

export const getServerSideProps = getGetServerSideProps("242062773274053");

export default function LifeSciencesContactUsForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Life sciences contact us form"
			lead="Briefly tell us why you're getting in touch. We'll then give you an indication of how we can support you. In most cases, we'll include estimated costs and timelines sent straight to your inbox."
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
			formFooter={
				<p>
					As you have expressed an interest in NICE&apos;s support services,
					your details will be added to our mailing list so that you can receive
					the latest news about NICE&apos;s support for the life sciences
					sector. You can unsubscribe from this at any time. Our legal basis for
					processing your data in this way is that of public task. View our{" "}
					<Link to="/privacy-notice">privacy notice</Link> for more information.
				</p>
			}
		/>
	);
}
