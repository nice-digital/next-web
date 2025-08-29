import { Panel } from "@nice-digital/nds-panel";

import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";

export const getServerSideProps = getGetServerSideProps("230793530776059");

const InformationPanel = () => {
	return (
		<>
			<Panel>
				<h2 className="h3">Supporting information</h2>
				<p>
					Send any published data and evidence in support of your submission to:
				</p>
				<p>
					<a href="mailto:ip@nice.org.uk?subject=Interventional procedure notification - supporting documentation">
						ip@nice.org.uk
					</a>
				</p>

				<p> Please include: </p>
				<ul>
					<li> your name </li>
					<li> the name of the procedure, or </li>
					<li>
						the name and number of our existing guidance you think should be
						reviewed
					</li>
					<li> details of any confidential information. </li>
				</ul>
			</Panel>
		</>
	);
};

export default function InterventionalProceduresNotificationForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Interventional procedures notification"
			lead="Tell us about an interventional procedure you think should be assessed by NICE. This can be a new procedure or a review of our existing guidance."
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
			informationPanel={<InformationPanel />}
		/>
	);
}
