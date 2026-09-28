export enum FeedPath {
	TopicBrowseProductMappings = "/topicBrowseProductMappings",
}

export type TaxonomyBreadcrumb = {
	title: string;
	url: string;
};

export type TaxonomyBreadcrumbObject = {
	breadcrumb: TaxonomyBreadcrumb[];
};

export type TaxonomyProductMappings = {
	productIds: string[];
	id: string;
	parentId?: string;
	name: string;
	identifier: string;
	slug: string;
	categories: TaxonomyProductMappings[];
};

export type ErrorResponse = {
	statusCode: string;
	message: string;
};
