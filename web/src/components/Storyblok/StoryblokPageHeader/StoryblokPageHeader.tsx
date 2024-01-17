import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Hero } from "@nice-digital/nds-hero";

import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import { type PageHeaderStoryblok } from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

interface PageHeaderBlokProps {
	blok: PageHeaderStoryblok;
	breadcrumbs?: TypeBreadcrumb[];
}

function formatDate(date: string): string {
	return new Intl.DateTimeFormat("en-GB", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(date));
}

export const StoryblokPageHeader = ({
	blok,
	breadcrumbs,
}: PageHeaderBlokProps): React.ReactElement => {
	console.log(breadcrumbs);
	const BreadcrumbComponent = breadcrumbs?.length ? (
		<Breadcrumbs>
			{[{ title: "Home", path: "/" }, ...breadcrumbs].map((breadcrumb) => (
				<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
					{breadcrumb.title}
				</Breadcrumb>
			))}
		</Breadcrumbs>
	) : undefined;

	console.log("Page header blok:", blok);
	return (
		<>
			<Hero
				title={blok.title}
				intro={blok.summary || undefined}
				header={BreadcrumbComponent}
			/>
			{blok.description && (
				<p>
					TO DO: Description (this will eventually go into the new page header:){" "}
					{blok.description}
				</p>
			)}
			{blok.ctaLink && blok.ctaText && (
				<p>
					<a href={resolveStoryblokLink(blok.ctaLink)}>
						TO DO: CTA: {blok.ctaText} (not implemented yet - will arrive in the
						new page header
					</a>
				</p>
			)}
			{blok.date && <time dateTime={blok.date}>{formatDate(blok.date)}</time>}
		</>
	);
};
