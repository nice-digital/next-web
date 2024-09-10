import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import {
	ButtonLinkStoryblok,
	type PageHeaderStoryblok,
} from "@/types/storyblok";

import { StoryblokButtonLink } from "../StoryblokButtonLink/StoryblokButtonLink";

interface PageHeaderBlokProps {
	blok: PageHeaderStoryblok;
	breadcrumbs?: TypeBreadcrumb[];
}

export const StoryblokPageHeader = ({
	blok,
	breadcrumbs,
}: PageHeaderBlokProps): React.ReactElement => {
	const BreadcrumbComponent = breadcrumbs?.length ? (
		<Breadcrumbs>
			{[{ title: "Home", path: "/" }, ...breadcrumbs].map((breadcrumb) => (
				<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
					{breadcrumb.title}
				</Breadcrumb>
			))}
		</Breadcrumbs>
	) : undefined;

	const { title, summary, description, cta } = blok;
	let updatedCTA: ButtonLinkStoryblok | undefined = undefined;

	// Force button to CTA variant for this template
	if (cta?.length) {
		updatedCTA = {
			...cta[0],
			variant: "cta",
		};
	}

	return (
		<>
			<PageHeader
				heading={title}
				lead={summary || undefined}
				breadcrumbs={BreadcrumbComponent}
				// header={BreadcrumbComponent}
				description={description}
				variant="fullWidthLight"
				verticalPadding="loose"
				cta={
					updatedCTA ? <StoryblokButtonLink button={updatedCTA} /> : undefined
				}
			/>
		</>
	);
};
