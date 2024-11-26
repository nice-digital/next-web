import Link from "next/link";
import { FC } from "react";

export interface SearchNoResultsProps {
	searchText: string;
}

export const SearchNoResults: FC<SearchNoResultsProps> = ({ searchText }) => {
	return (
		<>
			<section aria-labelledby="browse-for-content">
				<h3 id="browse-for-content">Try browsing by topic</h3>
				<p>
					Our <Link href="/guidance/conditions-and-diseases?">topic pages</Link>{" "}
					show all our products in a particular topic area
				</p>
			</section>
			<section aria-labelledby="try-other-services">
				<h3 id="try-other-services">Check our other services</h3>
				<p>See if there are results for your search on our other services:</p>
				<ul aria-label={`Search for "${searchText}" on our other services`}>
					<li>
						<a
							rel="noreferrer"
							target="_blank"
							href={`https://cks.nice.org.uk/search/?q=${searchText}&sp=on`}
						>
							CKS
						</a>
					</li>
					<li>
						<a
							rel="noreferrer"
							target="_blank"
							href={`https://bnf.nice.org.uk/search/?q=${searchText}&sp=on`}
						>
							BNF
						</a>
					</li>
					<li>
						<a
							rel="noreferrer"
							target="_blank"
							href={`https://bnfc.nice.org.uk/search/?q=${searchText}&sp=on`}
						>
							BNFc
						</a>
					</li>
				</ul>
				<section aria-labelledby="what-are-other-services">
					<h4 id="what-are-other-services">What are our other services?</h4>
					<h5>Clinical Knowledge Summaries (CKS)</h5>
					<p>
						Concise, accessible summaries of current evidence for primary care
						professionals. Information is presented as patient scenarios or
						clinical presentations with answers and links to supporting
						evidence.
					</p>
					<h5>BNF and BNFc</h5>
					<p>
						Drug and prescribing information for healthcare professionals. A
						reference for correct dosage, indication, interaction and side
						effects of drugs.
					</p>
				</section>
				<section aria-labelledby="check-the-nhs-website">
					<h3 id="check-the-nhs-website">Check the NHS website</h3>
					<p>
						For general information on health conditions, diseases or medicines
						check the <a href="https://www.nhs.uk/">NHS website</a>
					</p>
				</section>
			</section>
		</>
	);
};
