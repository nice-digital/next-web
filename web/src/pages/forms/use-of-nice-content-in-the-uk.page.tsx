import {
	type FormProps,
	getGetServerSideProps,
} from "@/components/JotFormPage/getGetServerSideProps";
import { JotFormPage } from "@/components/JotFormPage/JotFormPage";
import { Link } from "@/components/Link/Link";

import styles from "./forms.module.scss";

export const getServerSideProps = getGetServerSideProps("223412731228044");

const FormHeader = () => {
	return (
		<>
			<p>
				Note: If you plan to use our content in an international setting, you
				must submit the{" "}
				<a
					href="https://www.nice.org.uk/Media/Default/About/Reusing-our-content/Open-content-licence/International-use-of-NICE-content-form.docx"
					target="_blank"
					rel="noreferrer"
				>
					International use of NICE content form
				</a>
				.
			</p>
			<p>
				Requests to use third-party content, including Clinical Knowledge
				Summaries and the British National Formulary and its derivative outputs,
				are not covered by the terms of this licence. Please complete the
				permission form and we will forward requests to the relevant copyright
				owner.
			</p>
			<h2>Using our content in the UK</h2>
			<p>The NICE UK open content licence is a self-assessment exercise:</p>
			<ol id="instructions" className="alt">
				<li>
					<a href="#licence">Read the licence</a> carefully before using our
					content and adhere to its terms and conditions.
				</li>
				<li>
					Fill in the <a href="#form">use of NICE content form</a> below,
					telling us how you intend to use our content.
				</li>
			</ol>
		</>
	);
};

const FormFooter = () => {
	return (
		<>
			<h2>Content assurance service</h2>
			<p>
				Our experts can review the use of NICE content in your products or
				services.
			</p>
			<p>Our services include:</p>
			<ul>
				<li>checking your use of our content for accuracy and context</li>
				<li>editorial services</li>
				<li>feedback on your use of our content</li>
				<li>fast turnaround</li>
				<li>approval of artwork.</li>
			</ul>
			<Link to="https://www.nice.org.uk/re-using-our-content/content-assurance-service">
				Find out more about our content assurance service.
			</Link>
			<details id="licence" className={styles.details}>
				<summary>
					<strong>View the NICE UK open content licence</strong>
				</summary>
				<div>
					<p>
						Read the licence carefully before using our content and adhere to
						its terms and conditions.
					</p>
					<p>
						Requests to use our content for artificial intelligence (AI)
						purposes in the United Kingdom and internationally are not covered
						by the terms of this licence. To obtain permission, please complete
						the{" "}
						<Link href="/reusing-our-content/permission-to-use-nice-content-for-ai-purposes">
							permission to use NICE content for artificial intelligence (AI)
							purposes form.
						</Link>
					</p>
					<p>
						Requests to use third-party content, including Clinical Knowledge
						Summaries and the British National Formulary and its derivative
						outputs, are not covered by the terms of this licence. Please
						complete the permission form and we will forward requests to the
						relevant copyright owner.
					</p>
					<p>
						You are encouraged to use the information that is available under
						this licence freely and flexibly, with only a few conditions.
					</p>
					<h3>Using information under this licence</h3>
					<ol>
						<li>
							Using the copyright material expressly made available under this
							licence (the &apos;information&apos;) indicates you accept its
							terms and conditions.
						</li>
						<li>
							NICE grants you a UK-only, royalty-free, perpetual, non-exclusive
							licence to use the information subject to the conditions below.
						</li>
						<li>
							This licence does not affect your freedom under fair dealing or
							fair use or any other copyright or database right exceptions and
							limitations.
						</li>

						<li>
							Under the terms of this licence you may:
							<ul>
								<li>
									edit, copy, publish, distribute and transmit the information,
									in part or in full, save for content covered in clause 6;
								</li>
								<li>
									translate the information{" "}
									<a href="#definitions"> (see &apos;definitions&apos;); </a>
								</li>
								<li>
									exploit the information commercially and non-commercially —
									for example, by combining it with other information, or by
									including it in your own product or application.
								</li>
							</ul>
						</li>

						<li>
							Under the terms of this licence you are not permitted to:
							<ul>
								<li>
									amend or adapt the wording or structure of any published
									individual NICE guidance recommendations, quality statements
									or substantial algorithms. These should be reproduced as
									originally published by NICE{" "}
									<a href="#definitions"> (see &apos;definitions&apos;)</a>;
								</li>
								<li>
									display the information next to any advertising or promotional
									text(s) or use the information in or on websites, or alongside
									services that feature content (in any form) in any of the
									categories set out in Schedule A.
								</li>
							</ul>
						</li>

						<li>
							Under the terms of this licence you must:
							<ul>
								<li>
									acknowledge the source of the information in the
									&apos;product&apos; (including if the content is not visible
									but used to underpin a product in part or in full) in which it
									is used by including an attribution statement and a
									disclaimer. (A product means any route by which you distribute
									the information, such as a publication, article or
									application). Where possible, the statement should link to
									both this licence and the NICE source material. The form of
									words we require is:
									<p>
										&apos;© NICE [YEAR] TITLE. Available from
										www.nice.org.uk/guidance/ngXX All rights reserved. Subject
										to{" "}
										<a href="https://www.nice.org.uk/terms-and-conditions#notice-of-rights">
											Notice of rights{" "}
										</a>
									</p>
									<p>
										NICE guidance is prepared for the National Health Service in
										England. All NICE guidance is subject to regular review and
										may be updated or withdrawn. NICE accepts no responsibility
										for the use of its content in this
										product/publication.&apos;
									</p>
								</li>
							</ul>
						</li>

						<li>
							If your article, publication, product or app is to have longevity,
							you must make it clear that the information provided by NICE was
							accurate at the time your product was issued.
						</li>

						<li>
							Please note that copyright in the original NICE publication(s)
							covered by this licence is not transferable and rests with NICE.
						</li>

						<li>
							You will own the copyright in the format/layout/typographical
							arrangement of the information in your own product to the extent
							that it differs from that of NICE content.
						</li>

						<li>
							The conditions of this licence are important and if you fail to
							comply with them the rights granted to you under this licence, or
							any similar licence granted by NICE, will end automatically.
						</li>
					</ol>
					<h3>Exemptions</h3>
					<ol>
						<li>
							This licence does not cover:
							<ul>
								<li>
									Personal data in the information
									<a href="#definitions"> (see definitions); </a>
								</li>
								<li>
									Information that has not been accessed by way of publication
									or disclosure under information access legislation (including
									the Freedom of Information Acts for the UK and Scotland) or
									with the consent of NICE.
								</li>
								<li>
									Current and former NICE logos; the former National Prescribing
									Centre logo; the Health Development Agency logo; and other
									partners&apos; logos.
								</li>
								<li>
									Content that is made available as part of a consultation
									process and is subject to amendment before formal publication
									by NICE.
								</li>
								<li>
									Content that is made available through the NICE Scientific
									Advice programme.
								</li>
								<li>
									Third-party rights that NICE is not authorised to licence - it
									is incumbent on you to seek permission to use any identified
									third-party copyright content in the NICE information covered
									by this licence. For the avoidance of doubt, this covers all
									Clinical Knowledge Summaries, the British National Formulary
									and its derivative outputs, the &apos;full&apos; versions of
									NICE clinical guidelines commissioned from National
									Collaborating Centres, and economic models underpinning
									guidance development work.
								</li>
								<li>
									Other intellectual property rights, including patents,
									trademarks, and design rights.
								</li>
							</ul>
						</li>
					</ol>
					<h3>Non-endorsement</h3>
					<ol>
						<li>
							Granting you this licence does not confer an approval or
							endorsement of your article / publication / product / app or any
							accompanying marketing materials. You must not give any such
							implication that NICE endorses either you or your product.
						</li>
					</ol>
					<h3>Excluded organisations and content categories</h3>
					<ol>
						<li>
							Schedule A lists those organisations and content categories
							excluded from using NICE content under this licence.
						</li>
					</ol>
					<h3>No warranty</h3>
					<ol>
						<li>
							The information is licensed &apos;as is&apos; and NICE excludes
							all representations, warranties, obligations and liabilities in
							relation to the information to the maximum extent permitted by
							law.
						</li>
						<li>
							NICE is not liable for any errors or omissions in the information
							and shall not be liable for any loss, injury or damage of any kind
							caused by its use.
						</li>
						<li>
							NICE does not guarantee the continued supply of the information.
						</li>
						<li>
							NICE gives no warranty that the NICE content under this licence is
							fit for your intended purpose.
						</li>
					</ol>
					<h3>Governing Law</h3>
					<ol>
						<li>
							This licence is subject to English law and the English courts have
							exclusive jurisdiction.
						</li>
					</ol>
					<h3 id="definitions">Definitions</h3>
					<ol>
						<li>
							In this licence, the terms below have the following meanings:
							<ul>
								<li>
									&apos;Amend&apos; means to change the words or structure of
									specific content which is prohibited for certain types of NICE
									content listed in clause 6 of this licence.
								</li>
								<li>
									&apos;Information&apos; means information protected by
									copyright or by database right (for example, literary and
									artistic works, content, data and source code) offered for use
									under the terms of this licence.
								</li>
								<li>
									&apos;NICE&apos; is the current National Institute for Health
									and Care Excellence or its 2 predecessor organisations - the
									National Institute for Health and Clinical Excellence and the
									National Institute for Clinical Excellence.
								</li>
								<li>
									&apos;Personal data&apos; is defined in Article 2 of European
									Data Protection Directive by reference to whether information
									relates to an identified or identifiable individual.
								</li>
								<li>
									&apos;Translate&apos; means either translating content into
									another language or electronically repurposing it for use in
									the UK only.
								</li>
								<li>
									&apos;Use&apos; means doing any act which is restricted by
									copyright or database right, whether in the original medium or
									in any other medium, and includes without limitation
									distributing, copying, adapting (subject to the caveat in
									clause 5), modifying as may be technically necessary to use it
									in a different mode or format.
								</li>
								<li>
									&apos;You&apos;, &apos;you&apos; and &apos;your&apos; means
									the natural or legal person, or body of persons corporate or
									incorporate, acquiring rights in the information (whether the
									information is obtained directly from NICE or otherwise) under
									this licence.
								</li>
							</ul>
						</li>
					</ol>
					<h3>Further information</h3>
					<ol>
						<li>
							For further information about this licence please contact:
							<ul className="unstyled">
								<li>National Institute for Health and Care Excellence</li>
								<li>Level 1A, City Tower</li>
								<li>Piccadilly Plaza</li>
								<li>Manchester</li>
								<li>M1 4BT</li>
								<li>
									Telephone: <a href="tel:+03003230140">+44 (0)300 323 0140</a>
								</li>
								<li>
									Email:{" "}
									<a href="mailto:reuseofcontent@nice.org.uk">
										reuseofcontent@nice.org.uk
									</a>
								</li>
							</ul>
						</li>
					</ol>
					<h3>
						Schedule A: content categories and organisations not covered by this
						licence
					</h3>
					<ol>
						<li>
							Political,that is, lobby groups, pressure groups and political
							parties.
						</li>
						<li>Religious bodies.</li>
						<li>
							Content promoting any tobacco products or any other goods bearing
							tobacco applicant brand.
						</li>
						<li>Content promoting betting and gambling.</li>
						<li>
							Content promoting adult services including escort agencies and
							premium rate telephone numbers for adult chat services.
						</li>
						<li>
							Content promoting weapons, weapon manufacturers and gun clubs.
						</li>
						<li>Content promoting, encouraging or facilitating violence.</li>
						<li>
							Content that is libellous, misleading, pornographic, defamatory,
							or that contains illegal, infringing, or otherwise actionable
							content under UK law.
						</li>
						<li>
							Content that incites hatred whether based on race, religion,
							gender, sexuality or otherwise, or promote encourage or facilitate
							anti-social behaviour
						</li>
						<li>
							Content that promotes, encourages or facilitates terrorism or
							other activities that risk UK national security.
						</li>
						<li>
							Content that discriminates against any specific social group or
							otherwise exploits vulnerable sections of society.
						</li>
						<li>
							Content that contains exaggerated, misleading or false claims.
						</li>
						<li>
							Content that exploits the credulity, lack of knowledge or
							inexperience of consumers.
						</li>
						<li>
							Content that might cause offence or harm or may otherwise bring
							NICE into disrepute.
						</li>
						<li>Content categories otherwise notified to you by NICE.</li>
					</ol>
					<p>
						You can also&nbsp;
						<a href="https://www.nice.org.uk/Media/Default/About/Reusing-our-content/Open-content-licence/NICE-UK-Open-Content-Licence-.pdf">
							download the NICE Open Content Licence (PDF)
						</a>
						.
					</p>
				</div>
			</details>
		</>
	);
};

export default function UseOfNICEContentInTheUKForm(
	props: FormProps
): JSX.Element {
	return (
		<JotFormPage
			{...props}
			formName="Use of NICE content in the UK form"
			lead="This licence allows individuals, commercial organisations and non-commercial organisations to reuse NICE content free of charge in their publications, products and systems. It applies to requests to use our content in a UK setting only."
			parentPages={[
				{
					title: "Reusing our content",
					path: "/re-using-our-content",
				},
			]}
			formHeader={<FormHeader />}
			formFooter={<FormFooter />}
		/>
	);
}
