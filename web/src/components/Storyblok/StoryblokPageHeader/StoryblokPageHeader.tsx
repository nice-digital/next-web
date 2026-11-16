import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { PageHeader } from "@nice-digital/nds-page-header";

import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import {
	ButtonLinkStoryblok,
	InfoPageStoryblok,
	type PageHeaderStoryblok,
} from "@/types/storyblok";
import {
	ExtendedSBLink,
	getSectionTitle,
	treeHasItems,
} from "@/utils/storyblok/contentStructureUtils";

import { StoryblokButtonLink } from "../StoryblokButtonLink/StoryblokButtonLink";

interface PageHeaderBlokProps {
	blok: PageHeaderStoryblok;
	breadcrumbs?: TypeBreadcrumb[];
	preheading: string;
}

export const getPreheading = (
	tree: ExtendedSBLink[],
	blok: InfoPageStoryblok
): string => {
	if (!treeHasItems(tree)) return "";

	const headerTitle =
		blok.header?.[0]?.component === "pageHeader" ? blok.header?.[0]?.title : "";
	const sectionTitle = getSectionTitle(tree)?.name;

	if (!headerTitle || !sectionTitle) return "";

	return sectionTitle !== headerTitle ? sectionTitle : "";
};

export const StoryblokPageHeader = ({
	blok,
	breadcrumbs,
	preheading,
}: PageHeaderBlokProps): React.ReactElement => {
	const BreadcrumbComponent = breadcrumbs?.length ? (
		<Breadcrumbs>
			{breadcrumbs.map((breadcrumb) => (
				<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
					{breadcrumb.title}
				</Breadcrumb>
			))}
		</Breadcrumbs>
	) : undefined;

	const { title, summary, description, cta, theme } = blok;
	let updatedCTA: ButtonLinkStoryblok | undefined = undefined;

	// Force button to CTA variant for this template
	if (cta?.length) {
		updatedCTA = {
			...cta[0],
			variant: "cta",
		};
	}

	return (
		<PageHeader
			heading={title}
			preheading={preheading}
			lead={summary || undefined}
			breadcrumbs={BreadcrumbComponent}
			description={description}
			variant={theme === "impact" ? "fullWidthDark" : "fullWidthLight"}
			verticalPadding="loose"
			cta={updatedCTA ? <StoryblokButtonLink blok={updatedCTA} /> : undefined}
		/>
	);
};
