import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";
import { Link } from "@/components/Link/Link";

export const getServerSideProps = getGetServerSideProps("232422582693863");

const FormHeader = () => {
	return (
		<>
			<p>
				Our GP reference panel aims to gather the collective wisdom of GPs on
				the ground who might not otherwise be heard. We welcome registration by
				any GP currently on a performers list anywhere in the UK.
			</p>
			<h2>What&apos;s involved?</h2>
			<p>
				We will email relevant questions for your feedback. All you need to do
				is spare a few minutes every now and then to put your thoughts into an
				email.
			</p>

			<p>You&apos;ll have the opportunity to tell us if:</p>

			<ul>
				<li>our guidelines need improving</li>
				<li>we should produce guidance on a particular topic</li>
				<li>
					a guideline doesn&apos;t answer the questions which really matter to
					you or your patients
				</li>
				<li>our recommendations could be clearer.</li>
			</ul>
			<p>
				Our panel moderators, James Larcombe and Julian Treadwell are both
				practising GPs. They will help us to make the best use of your comments
				and keep you informed about their impact.
			</p>

			<h3>Resources for panel members</h3>
			<ul>
				<li>
					<Link to="/Media/Default/Communities/GP/GP-reference-panel-confidentiality-form.docx">
						confidentiality form (Word)
					</Link>
				</li>
				<li>
					<Link to="/Media/Default/Communities/GP/Guide-to-commenting.pdf">
						guide to commenting (PDF)
					</Link>
				</li>
				<li>
					<Link to="/Media/Default/Communities/GP/examples-of-good-comments.pdf">
						examples of good comments (PDF).
					</Link>
				</li>
			</ul>
		</>
	);
};

const FormFooter = () => {
	return (
		<>
			<p>
				The information provided on this form will be used to send you the
				latest news, updates and information from NICE. To manage your
				subscription, we need to share your data with{" "}
				<a href="http://www.mailchimp.com">MailChimp</a>.
			</p>
			<p>
				You can unsubscribe at any time using the link in the newsletters. For
				more information about how we process your personal data, please see our{" "}
				<Link to="/privacy-notice">privacy notice</Link>.
			</p>
		</>
	);
};

export default function SubscribeToOurGPReferencePanelForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Subscribe to our GP reference panel"
			lead="Contribute to the development of NICE guidance in a quick and easy way."
			parentPages={[
				{
					title: "General practice",
					path: "/about/nice-communities/generalpractice",
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
			formHeader={<FormHeader />}
			formFooter={<FormFooter />}
		/>
	);
}
