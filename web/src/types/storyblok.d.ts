/* eslint-disable @typescript-eslint/no-explicit-any */
import { StoryblokStory } from "storyblok-generate-ts";

export type StoryblokStory = StoryblokStory;

export type MultilinkStoryblok =
	| {
			cached_url?: string;
			linktype?: string;
			[k: string]: any;
	  }
	| {
			id?: string;
			cached_url?: string;
			anchor?: string;
			linktype?: "story";
			story?: {
				name: string;
				created_at?: string;
				published_at?: string;
				id: number;
				uuid: string;
				content?: {
					[k: string]: any;
				};
				slug: string;
				full_slug: string;
				sort_by_date?: null | string;
				position?: number;
				tag_list?: string[];
				is_startpage?: boolean;
				parent_id?: null | number;
				meta_data?: null | {
					[k: string]: any;
				};
				group_id?: string;
				first_published_at?: string;
				release_id?: null | number;
				lang?: string;
				path?: null | string;
				alternates?: any[];
				default_full_slug?: null | string;
				translated_slugs?: null | any[];
				[k: string]: any;
			};
			[k: string]: any;
	  }
	| {
			url?: string;
			cached_url?: string;
			anchor?: string;
			linktype?: "asset" | "url";
			[k: string]: any;
	  }
	| {
			email?: string;
			linktype?: "email";
			[k: string]: any;
	  };

export interface CardStoryblok {
	heading: string;
	body: string;
	link?: MultilinkStoryblok;
	_uid: string;
	component: "card";
	[k: string]: any;
}

export interface CardGridStoryblok {
	cards: CardStoryblok[];
	columns: string;
	_uid: string;
	component: "cardGrid";
	[k: string]: any;
}

export interface CategoryNavigationStoryblok {
	hero: HeroStoryblok[];
	cardGrid: CardGridStoryblok[];
	metadata?: MetadataStoryblok[];
	_uid: string;
	component: "categoryNavigation";
	[k: string]: any;
}

export interface GridStoryblok {
	columns?: any[];
	_uid: string;
	component: "grid";
	[k: string]: any;
}

export interface GridItemStoryblok {
	cols?: string;
	block?: CardStoryblok[];
	_uid: string;
	component: "gridItem";
	[k: string]: any;
}

export interface HeroStoryblok {
	title: string;
	intro?: string;
	_uid: string;
	component: "hero";
	[k: string]: any;
}

export interface HomepageStoryblok {
	body: (CardGridStoryblok | RichTextStoryblok)[];
	metadata?: MetadataStoryblok[];
	_uid: string;
	component: "homepage";
	[k: string]: any;
}

export interface MetadataStoryblok {
	description?: string;
	creator?: string;
	_uid: string;
	component: "metadata";
	[k: string]: any;
}

export interface PageStoryblok {
	body?: any[];
	metadata?: MetadataStoryblok[];
	_uid: string;
	component: "page";
	uuid?: string;
	[k: string]: any;
}
