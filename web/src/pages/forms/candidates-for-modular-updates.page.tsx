import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("242462190388056");

const FormHeader = () => (
	<>
		<p>
			Tell us about a modular update that you think should be considered by
			NICE. Please do not include any confidential information in your
			responses. For information on how personal data is used, see{" "}
			<a href="/privacy-notice">NICE&apos;s privacy notice</a>. If your
			organisation or professional association is being engaged with separately
			then there is no need to complete this form.
		</p>
		<p>
			You will not receive a formal response to your submission but we may get
			in touch if we require further detail or clarifications are required. In
			addition to considering your suggestion for a modular update, NICE will
			also consider whether it may be more suitable as the topic of an
			exploratory project led by the NICE Health Technology Assessment
			Innovation Laboratory (HTA Lab). For example, this could happen when:
		</p>
		<ul>
			<li>
				the suggested method is particularly novel and may still be maturing
			</li>
			<li>
				there is at least one alternative new method that could also be
				considered alongside your suggestion
			</li>
			<li>
				the method appears promising but has not yet been tested in the
				appropriate context.
			</li>
		</ul>

		<p>
			For more information and an overview visit the{" "}
			<a href="/what-nice-does/our-research-work/hta-lab/hta-lab-projects">
				HTA Lab projects page
			</a>
			.
		</p>

		<p>
			The outcome of the modular updates selection process and information about
			modular updates in progress will be communicated on the{" "}
			<a href="/what-nice-does/our-guidance/modular-updates">
				modular update page
			</a>
			.
		</p>
		<p>By submitting this form you agree to be contacted by NICE.</p>
		<p>Fields marked with an asterisk (*) are mandatory.</p>
	</>
);
export default function CandidatesForModularUpdatesForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Candidates for modular updates form"
			lead=""
			parentPages={[
				{
					title: "Modular updates",
					path: "/what-nice-does/our-guidance/modular-updates",
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
			formHeader={<FormHeader />}
		/>
	);
}
