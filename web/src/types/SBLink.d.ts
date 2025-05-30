// Responses from the links API, which Storyblok don't supply types for (yet)
// https://www.storyblok.com/docs/api/content-delivery/v2#core-resources/links/links

export type SBLink = {
	id: number;
	slug: string;
	name: string;
	is_folder: boolean;
	parent_id: number | null;
	published: boolean;
	position: number;
	uuid: string;
	is_startpage: boolean;
	real_path: string;
	path: string | null;
};

// The API response consists of an arbitrary number of properties
// The key of each property is a guid; the value is the link object itself
export type SBLinkRecord = Record<string, SBLink>;

// This is what we actually get back from the API
export type SBLinkResponse = {
	[SBLinkRecord];
};
