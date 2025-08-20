import { Panel } from "@nice-digital/nds-panel";

import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("222271911976056");

export default function InterventionalProceduresRegisterAnInterestForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Interventional procedures register an interest form"
			lead="Sign up to receive email updates on interventional procedures guidance."
			parentPages={[
				{
					title: "Notify an interventional procedure",
					path: "/what-nice-does/our-guidance/about-interventional-procedures-guidance/notify-an-interventional-procedure",
				},
				{
					title: "About interventional procedures guidance",
					path: "/what-nice-does/our-guidance/about-interventional-procedures-guidance",
				},
				{
					title: "Our guidance",
					path: "/what-nice-does/our-guidance",
				},
				{
					title: "What NICE does",
					path: "/what-nice-does",
				},
			]}
			informationPanel={
				<Panel>
					<h3 className="h4">Suggest a procedure</h3>
					<p>
						Tell us about a procedure that you think should be assessed by our
						interventional procedures programme.
					</p>
					<p>
						<a href="/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/ip-notification-form">
							Notify a procedure to NICE
						</a>
						.
					</p>
				</Panel>
			}
			formHeader={
				<>
					<p>We&apos;ll let you know when:</p>
					<ul>
						<li>you can comment on draft recommendations</li>
						<li>the final recommendations are published</li>
						<li>published guidance is being reviewed.</li>
					</ul>
				</>
			}
			formFooter={
				<>
					<p>
						We&apos;ll use the information you provide on this form to contact
						you about the procedures you want to stay up to date with.
					</p>
					<p>
						For more information about how we use your data, view our{" "}
						<a href="/privacy-notice">privacy notice</a>.
					</p>
				</>
			}
		/>
	);
}
