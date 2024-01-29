import { Breadcrumbs, Breadcrumb } from "@nice-digital/nds-breadcrumbs";
import { Grid, GridItem } from "@nice-digital/nds-grid";
import { Hero } from "@nice-digital/nds-hero";
import { PageHeader, PageHeaderProps } from "@nice-digital/nds-page-header";
import { Tag } from "@nice-digital/nds-tag";

import { type Breadcrumb as TypeBreadcrumb } from "@/types/Breadcrumb";
import { type PageHeaderStoryblok } from "@/types/storyblok";
import { resolveStoryblokLink } from "@/utils/storyblok";

import styles from "./StoryblokPageHeader.module.scss";

interface PageHeaderBlokProps {
	blok: PageHeaderStoryblok;
	breadcrumbs?: React.ReactNode;
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
	// const BreadcrumbComponent = breadcrumbs?.length ? (
	// 	<Breadcrumbs>
	// 		{[{ title: "Home", path: "/" }, ...breadcrumbs].map((breadcrumb) => (
	// 			<Breadcrumb key={breadcrumb.title} to={breadcrumb.path}>
	// 				{breadcrumb.title}
	// 			</Breadcrumb>
	// 		))}
	// 	</Breadcrumbs>
	// ) : undefined;

	const Footer = () => {
		const pageType =
			blok.pageType === "newsArticle"
				? "News"
				: blok.pageType === "blogPost"
				? "Blog"
				: null;
		return (
			<div className={styles.footerMeta}>
				{pageType && <Tag outline>{pageType}</Tag>}

				{blok.date && <time dateTime={blok.date}>{formatDate(blok.date)}</time>}
			</div>
		);
	};

	return (
		<>
			<PageHeader
				isFullWidth={true}
				heading={blok.title}
				lead={blok.summary || undefined}
				breadcrumbs={breadcrumbs}
			/>
			{/* <Hero
				title={blok.title}
				intro={blok.summary || undefined}
				header={BreadcrumbComponent}
				footer={<Footer />}
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
			)} */}
		</>
	);
};
