import { StoryblokComponent } from "@storyblok/react";
import { render, screen } from "@testing-library/react";

import { InfoPageStoryblok } from "@/types/storyblok";

import { InfoPage } from "./InfoPage";

jest.mock("@storyblok/react", () => ({
	StoryblokComponent: jest.fn(() => <div>Mocked Storyblok Component</div>),
}));

jest.mock("@/components/Storyblok/StoryblokRichText/StoryblokRichText", () => ({
	StoryblokRichText: jest.fn(() => <div>Mocked Rich Text Content</div>),
}));

describe("InfoPage", () => {
	const blok = {
		_uid: "uid1",
		header: [
			{
				cta: [
					{
						_uid: "uid2",
						link: {
							id: "",
							url: "https://example.com/guidance",
							linktype: "url",
							fieldtype: "multilink",
							cached_url: "https://example.com/guidance",
						},
						text: "follow guidance link",
						variant: "cta",
						component: "buttonLink",
						_editable:
							'<!--#storyblok#{"name": "buttonLink", "space": "space1", "uid": "uid2", "id": "id1"}-->',
					},
				],
				_uid: "uid3",
				image: {
					id: 12345,
					alt: "",
					name: "",
					focus: "",
					title: "",
					source: "",
					filename: "https://example.com/image.jpg",
					copyright: "",
					fieldtype: "asset",
					meta_data: {},
					is_external_url: false,
				},
				title: "Hero header - test",
				ctaLink: {
					id: "",
					url: "",
					linktype: "story",
					fieldtype: "multilink",
					cached_url: "",
				},
				ctaText: "",
				summary: "Sample summary data.",
				component: "hero",
				description:
					"Sample description text about the service and how demand has grown over the years.",
				_editable:
					'<!--#storyblok#{"name": "hero", "space": "space1", "uid": "uid3", "id": "id1"}-->',
			},
		],
		content: {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [{ text: "Sample headline text", type: "text" }],
				},
				{
					type: "paragraph",
				},
				{
					type: "paragraph",
					content: [
						{
							text: "Sample sentence discussing a new treatment in draft guidance.",
							type: "text",
						},
					],
				},
				{
					type: "paragraph",
					content: [
						{
							text: "Details on the treatment and its licensing status.",
							type: "text",
						},
					],
				},
				{
					type: "paragraph",
					content: [
						{
							text: "Explanation of the treatment's impact.",
							type: "text",
						},
					],
				},
				{
					type: "heading",
					attrs: { level: 3 },
					content: [
						{
							text: "Recommended digital therapies for mental health",
							type: "text",
							marks: [
								{
									type: "link",
									attrs: {
										href: "https://example.com/news",
										uuid: null,
										anchor: null,
										target: null,
										linktype: "url",
									},
								},
								{ type: "bold" },
							],
						},
					],
				},
				{
					type: "paragraph",
					content: [{ text: "Record referrals for 2023.", type: "text" }],
				},
				{
					type: "blok",
					attrs: {
						id: "uid4",
						body: [
							{
								_uid: "uid5",
								title: "rest",
								content: {
									type: "doc",
									content: [
										{
											type: "paragraph",
											content: [{ text: "test content", type: "text" }],
										},
									],
								},
								variant: "subtle",
								component: "accordion",
								headingLevel: "4",
								displayTitleAsHeading: true,
								_editable:
									'<!--#storyblok#{"name": "accordion", "space": "space1", "uid": "uid5", "id": "id1"}-->',
							},
						],
					},
				},
			],
		},
		metadata: [
			{
				_uid: "uid6",
				component: "metadata",
				description: "Anonymised metadata description.",
				creator: "Anon",
				additionalField1: "Additional info",
				additionalField2: 42,
			},
		],
		component: "infoPage",
		isNavigationRoot: false,
		_editable:
			'<!--#storyblok#{"name": "infoPage", "space": "space1", "uid": "uid1", "id": "id1"}-->',
	} as InfoPageStoryblok;

	it("renders StoryblokComponent for header and metadata", () => {
		render(<InfoPage blok={blok} />);

		if (blok.metadata && blok.metadata.length > 0) {
			expect(StoryblokComponent).toHaveBeenCalledWith(
				expect.objectContaining({ blok: blok.metadata[0] }),
				expect.anything()
			);
		}
		expect(StoryblokComponent).toHaveBeenCalledWith(
			expect.objectContaining({ blok: blok.header[0] }),
			expect.anything()
		);
	});

	it("renders sibling pages in the StackedNav when provided", () => {
		const siblingPages = ["Page 1", "Page 2"];
		render(<InfoPage blok={blok} siblingPages={siblingPages} />);

		siblingPages.forEach((page) => {
			expect(screen.getByText(page)).toBeInTheDocument();
		});
	});

	it("renders StoryblokRichText content", () => {
		render(<InfoPage blok={blok} />);

		expect(screen.getByText("Mocked Rich Text Content")).toBeInTheDocument();
	});

	it("renders the StoryblokComponent for each nested blok in the content", () => {
		render(<InfoPage blok={blok} />);

		expect(StoryblokComponent).toHaveBeenCalledTimes(2);
		expect(screen.getAllByText("Mocked Storyblok Component")).toHaveLength(2);
	});
});
