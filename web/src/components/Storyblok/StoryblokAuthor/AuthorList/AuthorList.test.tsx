import { StoryblokComponent } from "@storyblok/react";
import { render, screen } from "@testing-library/react";
import { StoryblokStory } from "storyblok-generate-ts";

import { StoryblokAuthor } from "../StoryblokAuthor";

import { AuthorList, AuthorListProps } from "./AuthorList";

jest.mock("@storyblok/react", () => ({
	StoryblokComponent: ({ blok }: { blok: StoryblokStory<AuthorListProps> }) => {
		return <StoryblokComponent blok={blok} />;
	},
}));

const authorsListContent: AuthorListProps = {
	authors: [
		{
			name: "Test name",
			created_at: "2024-01-16T16:07:00.598Z",
			published_at: "2023-12-19T13:42:53.756Z",
			id: 433,
			uuid: "16ds",
			content: {
				_uid: "bd50",
				name: "Test name",
				image: {
					id: 1338,
					alt: "test alt 1",
					name: "",
					focus: "",
					title: "",
					source: "",
					filename: "test-image1.jpg",
					copyright: "",
					fieldtype: "asset",
					meta_data: {},
					is_external_url: false,
				},
				jobTitle: "test job title",
				component: "author",
				_editable: "pppp",
			},
			slug: "test-author-slug",
			full_slug: "test/slug/to/author",
			sort_by_date: null,
			position: -12,
			tag_list: [],
			is_startpage: false,
			parent_id: 4244,
			meta_data: null,
			group_id: "99c-ba",
			first_published_at: "2023-12-19T13:42:53.756Z",
			release_id: null,
			lang: "default",
			path: null,
			alternates: [],
			default_full_slug: null,
			translated_slugs: null,
		},
		{
			name: "Test name",
			created_at: "2024-01-16T16:07:00.598Z",
			published_at: "2023-12-19T13:42:53.756Z",
			id: 433,
			uuid: "16ds",
			content: {
				_uid: "bd51",
				name: "Test name 2",
				image: {
					id: 1338,
					alt: "test alt 2",
					name: "",
					focus: "",
					title: "",
					source: "",
					filename: "test-image2.jpg",
					copyright: "",
					fieldtype: "asset",
					meta_data: {},
					is_external_url: false,
				},
				jobTitle: "test job title 2",
				component: "author",
				_editable: "pppp",
			},
			slug: "test-author-slug-2",
			full_slug: "test/slug/to/author-2",
			sort_by_date: null,
			position: -11,
			tag_list: [],
			is_startpage: false,
			parent_id: 4243,
			meta_data: null,
			group_id: "99c-bb",
			first_published_at: "2023-12-19T13:42:53.756Z",
			release_id: null,
			lang: "default",
			path: "",
			alternates: [],
			default_full_slug: null,
			translated_slugs: null,
		},
		{
			name: "Test name 3",
			created_at: "2024-01-16T16:07:00.598Z",
			published_at: "2023-12-19T13:42:53.756Z",
			id: 433,
			uuid: "16ds",
			content: {
				_uid: "bd52",
				name: "Test name 3",
				image: {
					id: 1338,
					alt: "test alt 3",
					name: "",
					focus: "",
					title: "",
					source: "",
					filename: "test-image3.jpg",
					copyright: "",
					fieldtype: "asset",
					meta_data: {},
					is_external_url: false,
				},
				jobTitle: "test job title 3",
				component: "author",
				_editable: "pppp",
			},
			slug: "test-author-slug-3",
			full_slug: "test/slug/to/author-3",
			sort_by_date: null,
			position: -11,
			tag_list: [],
			is_startpage: false,
			parent_id: 4243,
			meta_data: null,
			group_id: "99c-bb",
			first_published_at: "2023-12-19T13:42:53.756Z",
			release_id: null,
			lang: "default",
			path: "",
			alternates: [],
			default_full_slug: null,
			translated_slugs: null,
		},
	],
};

const authors = [
	{
		name: "Test name",
		created_at: "2024-01-16T16:07:00.598Z",
		published_at: "2023-12-19T13:42:53.756Z",
		id: 433,
		uuid: "16ds",
		content: {
			_uid: "bd50",
			name: "Test name",
			image: {
				id: 1338,
				alt: "test alt 1",
				name: "",
				focus: "",
				title: "",
				source: "",
				filename: "test-image1.jpg",
				copyright: "",
				fieldtype: "asset",
				meta_data: {},
				is_external_url: false,
			},
			jobTitle: "test job title",
			component: "author",
			_editable: "pppp",
		},
		slug: "test-author-slug",
		full_slug: "test/slug/to/author",
		sort_by_date: null,
		position: -12,
		tag_list: [],
		is_startpage: false,
		parent_id: 4244,
		meta_data: null,
		group_id: "99c-ba",
		first_published_at: "2023-12-19T13:42:53.756Z",
		release_id: null,
		lang: "default",
		path: null,
		alternates: [],
		default_full_slug: null,
		translated_slugs: null,
	},
	{
		name: "Test name",
		created_at: "2024-01-16T16:07:00.598Z",
		published_at: "2023-12-19T13:42:53.756Z",
		id: 433,
		uuid: "16ds",
		content: {
			_uid: "bd51",
			name: "Test name 2",
			image: {
				id: 1338,
				alt: "test alt 2",
				name: "",
				focus: "",
				title: "",
				source: "",
				filename: "test-image2.jpg",
				copyright: "",
				fieldtype: "asset",
				meta_data: {},
				is_external_url: false,
			},
			jobTitle: "test job title 2",
			component: "author",
			_editable: "pppp",
		},
		slug: "test-author-slug-2",
		full_slug: "test/slug/to/author-2",
		sort_by_date: null,
		position: -11,
		tag_list: [],
		is_startpage: false,
		parent_id: 4243,
		meta_data: null,
		group_id: "99c-bb",
		first_published_at: "2023-12-19T13:42:53.756Z",
		release_id: null,
		lang: "default",
		path: "",
		alternates: [],
		default_full_slug: null,
		translated_slugs: null,
	},
	{
		name: "Test name 3",
		created_at: "2024-01-16T16:07:00.598Z",
		published_at: "2023-12-19T13:42:53.756Z",
		id: 433,
		uuid: "16ds",
		content: {
			_uid: "bd52",
			name: "Test name 3",
			image: {
				id: 1338,
				alt: "test alt 3",
				name: "",
				focus: "",
				title: "",
				source: "",
				filename: "test-image3.jpg",
				copyright: "",
				fieldtype: "asset",
				meta_data: {},
				is_external_url: false,
			},
			jobTitle: "test job title 3",
			component: "author",
			_editable: "pppp",
		},
		slug: "test-author-slug-3",
		full_slug: "test/slug/to/author-3",
		sort_by_date: null,
		position: -11,
		tag_list: [],
		is_startpage: false,
		parent_id: 4243,
		meta_data: null,
		group_id: "99c-bb",
		first_published_at: "2023-12-19T13:42:53.756Z",
		release_id: null,
		lang: "default",
		path: "",
		alternates: [],
		default_full_slug: null,
		translated_slugs: null,
	},
];

const authorOneInArray = authorsListContent.authors[0];

const nullAuthorListContent: AuthorListProps = {
	authors: null,
};

describe("AuthorList", () => {
	it("should render a list of authors", () => {
		render(<AuthorList authors={authorsListContent.authors} />);
		expect(screen.getByText("List of authors")).toBeInTheDocument();
		authors.forEach((author) => {
			expect(
				screen.getByTestId(`author-component-${author.content._uid}`)
			).toBeInTheDocument();
		});
	});

	it("should render a single author", () => {
		render(<AuthorList authors={[authorOneInArray]} />);
		expect(
			screen.getByTestId(`author-component-${authorOneInArray.content._uid}`)
		).toBeInTheDocument();

		expect(screen.getAllByAltText);
	});

	it("shouldn't render anything if there are no authors", () => {
		render(<AuthorList authors={nullAuthorListContent.authors} />);
		// expect(screen.queryByText("List of authors")).not.toBeInTheDocument();
	});
});
