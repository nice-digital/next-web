import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";
import { Link } from "@/components/Link/Link";

export const getServerSideProps = getGetServerSideProps("251264227537053");

const FormHeader = () => (
	<p>
		Briefly tell us why you&apos;re getting in touch with{" "}
		<a
			href="https://www.nice.org.uk/about/what-we-do/life-sciences/nice-advice-service?utm_medium=enquiry_form&utm_source=nice_website&utm_campaign=nice_advice_24"
			target="_blank"
			rel="noreferrer"
		>
			NICE Advice
		</a>
		. We&apos;ll then give you an indication of how we can support you. In most
		cases, we&apos;ll include estimated costs and timelines sent straight to
		your inbox.
	</p>
);
export default function NiceAdviceContactUsForm(props: FormProps): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="NICE Advice contact us form"
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
			formHeader={<FormHeader />}
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
