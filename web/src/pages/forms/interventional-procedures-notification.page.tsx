import { Panel } from "@nice-digital/nds-panel";

import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";
import { Link } from "@/components/Link/Link";

export const getServerSideProps = getGetServerSideProps("230793530776059");

const InformationPanel = () => {
	return (
		<>
			<p>
				<Link to="/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/notify">
					About our notification process
				</Link>
			</p>
			<Panel>
				<h3>Supporting information</h3>
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
			informationPanel={<InformationPanel />}
		/>
	);
}
