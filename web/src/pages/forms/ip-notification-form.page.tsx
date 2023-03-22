import { NextSeo } from "next-seo";

import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { JotFormEmbed } from "@/components/JotFormEmbed/JotFormEmbed";

export default function IPNotificationForms(): JSX.Element {
	return (
		<>
			<NextSeo
				title="Interventional procedures notification form | Notify a procedure | NICE interventional procedures guidance | NICE guidance | Our programmes | What we do | About"
				description="Tell us about an interventional procedure you think should be assessed by NICE. This can be a new procedure or a review of our existing guidance."
			/>

			<Breadcrumbs>
				<Breadcrumb to="/">Home</Breadcrumb>
				<Breadcrumb to="/about">About</Breadcrumb>
				<Breadcrumb to="/about/what-we-do">What we do</Breadcrumb>
				<Breadcrumb to="/about/what-we-do/our-programmes/nice-guidance">
					NICE guidance
				</Breadcrumb>
				<Breadcrumb to="/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance">
					NICE interventional procedures guidance
				</Breadcrumb>
				<Breadcrumb to="/about/what-we-do/our-programmes/nice-guidance/nice-interventional-procedures-guidance/notify">
					Notify a procedure
				</Breadcrumb>
				<Breadcrumb>Interventional procedures notification form</Breadcrumb>
			</Breadcrumbs>

			<PageHeader
				heading="Interventional procedures notification form"
				lead="Tell us about an interventional procedure you think should be assessed by NICE. This can be a new procedure or a review of our existing guidance."
				id="content-start"
			/>

			<JotFormEmbed
				jotFormID="230793530776059"
				title="Interventional procedures notification form"
			/>
		</>
	);
}
