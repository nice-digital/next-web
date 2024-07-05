import { render } from "@testing-library/react";
import { StoryblokStory } from "storyblok-generate-ts";

import { NewsStory } from "@/types/News";

import { NewsList } from "./NewsList";

const mockStory = {
	name: "New treatment to increase successful kidney transplants recommended by NICE",
	created_at: "2024-01-16T16:06:59.989Z",
	published_at: "2024-01-11T09:42:41.331Z",
	id: 428383184,
	uuid: "8540a620-2592-4a61-8331-7b44477b26d3",
	content: {
		_uid: "610628b9-6a46-4197-ae38-0f2572998269",
		date: "2022-06-16 00:00",
		image: {
			id: 13571551,
			alt: "",
			name: "Surgeons perform a kidney transplant",
			focus: "",
			title: "",
			source: "",
			filename:
				"https://local-host-test-nice-org.com/f/243782/724x483/ef045348c1/kidney-transplant.jpg",
			copyright: "",
			fieldtype: "asset",
			meta_data: {},
			is_private: "",
			is_external_url: false,
		},
		title:
			"New treatment to increase successful kidney transplants recommended by NICE",
		content: {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [
						{
							text: "Imlifidase (also known as Idefirix and made by Hansa Biopharma) has been recommended for people who are waiting for a kidney transplant",
							type: "text",
							marks: [
								{
									type: "link",
									attrs: {
										href: "https://www.nice.org.uk/guidance/indevelopment/gid-ta10552",
										uuid: null,
										anchor: null,
										target: "_self",
										linktype: "url",
									},
								},
							],
						},
						{
							text: " and who are highly sensitised to human leukocyte antigens (HLAs) to prevent the body rejecting the donor organ.",
							type: "text",
						},
					],
				},

				{
					type: "paragraph",
					content: [
						{
							text: "Clinical trial evidence based on 3-year follow-up data showed imlifidase was effective for preventing transplant rejection, and that the benefits could be maintained over time.",
							type: "text",
							marks: [
								{
									type: "textStyle",
									attrs: {
										color: "",
									},
								},
							],
						},
					],
				},

				{
					type: "paragraph",
					content: [
						{
							text: "“Imlifidase will provide these patients with an additional treatment option that could enable them to receive a kidney transplant from a wider pool of donors.”",
							type: "text",
							marks: [
								{
									type: "textStyle",
									attrs: {
										color: "",
									},
								},
							],
						},
					],
				},
			],
		},
	},
	slug: "mock-news-article",
	full_slug: "news/articles/mock-news-article",
	sort_by_date: null,
	position: -820,
	tag_list: [],
	is_startpage: false,
	parent_id: 428383157,
	meta_data: null,
	group_id: "5625b207-7bb8-4410-aac3-3d7d5743f97a",
	first_published_at: "2024-01-31T15:16:15.194Z",
	// release_id: null,
	lang: "default",
	path: null,
	alternates: [],
	default_full_slug: null,
	translated_slugs: null,
} as unknown as StoryblokStory<NewsStory>;

const mockNews: StoryblokStory<NewsStory>[] = [
	{
		...mockStory,
		name: "Article 1 name",
	},
	{
		...mockStory,
		name: "Article 2 name",
	},
	{
		...mockStory,
		name: "Article 3 name",
	},
];

describe("NewsList", () => {
	it("matches snapshot", () => {
		const { asFragment } = render(<NewsList news={mockNews} />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should match the snapshot if showImage is false", () => {
		const { asFragment } = render(
			<NewsList news={mockNews} showImage={false} />
		);
		expect(asFragment()).toMatchSnapshot();
	});
});
