import { NextSeo } from "next-seo";

import { PageHeader } from "@nice-digital/nds-page-header";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";

export default function FourOhFourPage(): JSX.Element {
	return (
		<>
			<NextSeo title="Page not found" />

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb>Page not found</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				heading="We can't find this&nbsp;page"
				lead="It's probably been moved, updated or&nbsp;deleted."
			/>

			<h2>What can I do&nbsp;now?</h2>

			<Grid gutter="loose" data-testid="wrapper">
				<GridItem cols={12} sm={6} md={4}>
					<ul className="mt--0">
						<li>Check that the web address has been typed correctly</li>
						<li>Look for it using search</li>
						<li>
							Browse for it from the <a href="/">homepage</a>
						</li>
					</ul>
					<p>
						And if you still can&apos;t find what you&apos;re looking for,{" "}
						<a href="/get-involved/contact-us">get in touch</a>.
					</p>
				</GridItem>
				<GridItem cols={12} sm={6} md={8}>
					<p className="mt--0">Here&apos;s where you can go from here:</p>
					<ul>
						<li>
							Explore{" "}
							<a href="/guidance">
								NICE guidance, quality standards and advice
							</a>
							. You can do this by{" "}
							<a href="/guidance/conditions-and-diseases">
								category to find a topic
							</a>
							, or choose a{" "}
							<a href="/guidance/published">list organised by date or title</a>.
						</li>
						<li>
							<a href="http://www.evidence.nhs.uk/">Try evidence search</a>.
							This is our unique index of authoritative, evidence-based
							information from hundreds of trustworthy and accredited sources.
						</li>
						<li>
							<a href="/about">Visit our about pages</a> to find information
							about our services, <a href="/about/who-we-are">who we are</a> and{" "}
							<a href="/about/what-we-do">what we do</a>
						</li>
					</ul>
					<p>
						If this is not the first time you have seen this message and believe
						that there is a serious problem{" "}
						<a href="/get-involved/contact-us">please contact us directly</a>
					</p>
				</GridItem>
			</Grid>
		</>
	);
}
