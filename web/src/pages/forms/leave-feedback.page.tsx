import { Button } from "@nice-digital/nds-button";

import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";
import { Link } from "@/components/Link/Link";

export const getServerSideProps = getGetServerSideProps("222773673466870");

export default function LeaveFeedbackForm(props: FormProps): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Website feedback"
			lead="Thank you for taking a look at our website, we'd like to hear your views."
			parentPages={[]}
			formHeader={
				<>
					This form is only for website feedback, for all other enquiries please{" "}
					<a href="/get-involved/contact-us">contact us</a>
				</>
			}
			formFooter={
				<>
					<p>
						We&apos;ll use the information you provide to monitor how our
						websites are performing and to see if there are ways we can improve
						them.
					</p>
					<p>
						If you&apos;ve provided your contact details we may contact you for
						further information about your feedback.
					</p>
					<p>
						For more information about how we use your data view our{" "}
						<a href="/privacy-notice">privacy notice</a>.
					</p>
					<h2>Take part in research to help us develop better products</h2>
					<p>You can influence:</p>
					<ul>
						<li>how we display our guidance</li>
						<li>changes to our websites and apps</li>
						<li>our understanding of what our users need.</li>
					</ul>

					<Button
						variant="cta"
						to="/get-involved/help-us-improve"
						elementType={Link}
					>
						Find out more
					</Button>
				</>
			}
		/>
	);
}
