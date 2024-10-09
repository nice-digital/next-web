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
		_uid: "4172c380-d200-439f-963a-b093bead4d3c",
		header: [
			{
				cta: [
					{
						_uid: "244f571a-88c4-40a8-84fb-29045fccd61d",
						link: {
							id: "",
							url: "https://alpha.nice.org.uk/guidance",
							linktype: "url",
							fieldtype: "multilink",
							cached_url: "https://alpha.nice.org.uk/guidance",
						},
						text: "follow guidance link",
						variant: "cta",
						component: "buttonLink",
						_editable:
							'<!--#storyblok#{"name": "buttonLink", "space": "292509", "uid": "244f571a-88c4-40a8-84fb-29045fccd61d", "id": "551380672"}-->',
					},
				],
				_uid: "335fe1a7-249a-459c-9853-a93d144a396b",
				image: {
					id: 16871731,
					alt: "",
					name: "",
					focus: "",
					title: "",
					source: "",
					filename:
						"https://a.storyblok.com/f/292509/274x122/1d5d0eabed/foo-me.JPG",
					copyright: "",
					fieldtype: "asset",
					meta_data: {},
					is_external_url: false,
				},
				title: "Hero header - test ",
				ctaLink: {
					id: "",
					url: "",
					linktype: "story",
					fieldtype: "multilink",
					cached_url: "",
				},
				ctaText: "",
				summary: "The service received 1.82 million referrals in 2023/24. ",
				component: "hero",
				description:
					"Demand for NHS Talking Therapies has reached an all-time high. This is slightly higher than 2021/2022, and more than double the 884,000 received in 2012/13. \nAs more people come forward for help, the NHS is looking to use NICE-recommended digital therapies to help increase the support available.",
				_editable:
					'<!--#storyblok#{"name": "hero", "space": "292509", "uid": "335fe1a7-249a-459c-9853-a93d144a396b", "id": "551380672"}-->',
			},
		],
		content: {
			type: "doc",
			content: [
				{
					type: "paragraph",
					content: [
						{
							text: "Dream comes true EVENTUALLY",
							type: "text",
						},
					],
				},
				{
					type: "paragraph",
				},
				{
					type: "paragraph",
					content: [
						{
							text: "The benefits of the new Alzheimer’s drug lecanemab are too small to justify the costs, NICE said in draft guidance published today.",
							type: "text",
						},
					],
				},
				{
					type: "paragraph",
					content: [
						{
							text: "Lecanemab (also called Leqembi and made by Eisai) is for slowing progression in mild cognitive impairment or mild dementia due to Alzheimer’s disease (AD) in adults and has been licensed by The Medicines and Healthcare products Regulatory Agency (MHRA) today.",
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
							text: "It is the first medicine to be licensed for Great Britain that has been shown to slow down progression of the disease, by between 4 and 6 months, NICE's independent committee heard.",
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
				},
				{
					type: "heading",
					attrs: {
						level: 3,
					},
					content: [
						{
							text: "NICE recommended digital therapies for depression and anxiety could free up thousands of NHS therapist hours",
							type: "text",
							marks: [
								{
									type: "link",
									attrs: {
										href: "https://www.nice.org.uk/news/articles/digital-therapies-for-depression-and-anxiety-disorders-recommended-by-nice-could-potentially-release-thousands-of-therapist-hours-for-the-nhs",
										uuid: null,
										anchor: null,
										target: null,
										linktype: "url",
									},
								},
								{
									type: "bold",
								},
							],
						},
					],
				},
				{
					type: "paragraph",
					content: [
						{
							text: "NHS Talking Therapies for anxiety and depression services saw record referrals in 2023/24.",
							type: "text",
						},
					],
				},
				{
					type: "blok",
					attrs: {
						id: "b9ecea46-1ccd-4928-92a7-db8f78b908e6",
						body: [
							{
								_uid: "i-b7fcf688-3302-492b-9b16-0f0013d5b72c",
								title: "rest",
								content: {
									type: "doc",
									content: [
										{
											type: "paragraph",
											content: [
												{
													text: "testy",
													type: "text",
												},
											],
										},
									],
								},
								variant: "subtle",
								component: "accordion",
								headingLevel: "4",
								displayTitleAsHeading: true,
								_editable:
									'<!--#storyblok#{"name": "accordion", "space": "292509", "uid": "i-b7fcf688-3302-492b-9b16-0f0013d5b72c", "id": "551380672"}-->',
							},
							{
								_uid: "i-29cedec9-ed46-4abf-a182-e5e942a63548",
								title: "best",
								content: {
									type: "doc",
									content: [
										{
											type: "paragraph",
											content: [
												{
													text: "reassure",
													type: "text",
												},
											],
										},
									],
								},
								variant: "callout",
								component: "accordion",
								headingLevel: "",
								displayTitleAsHeading: false,
								_editable:
									'<!--#storyblok#{"name": "accordion", "space": "292509", "uid": "i-29cedec9-ed46-4abf-a182-e5e942a63548", "id": "551380672"}-->',
							},
							{
								_uid: "i-9682a059-16c9-41a1-a695-ad8cbfb9fd0f",
								component: "accordionGroup",
								accordions: [
									{
										_uid: "697743a9-05e6-42d4-972b-980bf0853ebe",
										title: "group - test1",
										content: {
											type: "doc",
											content: [
												{
													type: "paragraph",
													content: [
														{
															text: "testsger",
															type: "text",
														},
													],
												},
											],
										},
										variant: "subtle",
										component: "accordion",
										headingLevel: "",
										displayTitleAsHeading: false,
										_editable:
											'<!--#storyblok#{"name": "accordion", "space": "292509", "uid": "697743a9-05e6-42d4-972b-980bf0853ebe", "id": "551380672"}-->',
									},
									{
										_uid: "d6d6e094-686c-4bce-bd17-3f344968ed53",
										title: "group-test1.1",
										content: {
											type: "doc",
											content: [
												{
													type: "paragraph",
													content: [
														{
															text: "teaterssfsfsfssf",
															type: "text",
														},
													],
												},
											],
										},
										variant: "callout",
										component: "accordion",
										headingLevel: "",
										displayTitleAsHeading: false,
										_editable:
											'<!--#storyblok#{"name": "accordion", "space": "292509", "uid": "d6d6e094-686c-4bce-bd17-3f344968ed53", "id": "551380672"}-->',
									},
								],
								_editable:
									'<!--#storyblok#{"name": "accordionGroup", "space": "292509", "uid": "i-9682a059-16c9-41a1-a695-ad8cbfb9fd0f", "id": "551380672"}-->',
							},
							{
								_uid: "i-781ba78e-4edf-40a8-a248-0e8a5f87b6cc",
								title: "My title",
								content: {
									type: "doc",
									content: [
										{
											type: "paragraph",
											content: [
												{
													text: "hjkhhjkhkj",
													type: "text",
												},
											],
										},
									],
								},
								variant: "subtle",
								component: "accordion",
								headingLevel: "2",
								displayTitleAsHeading: true,
								_editable:
									'<!--#storyblok#{"name": "accordion", "space": "292509", "uid": "i-781ba78e-4edf-40a8-a248-0e8a5f87b6cc", "id": "551380672"}-->',
							},
						],
					},
				},
			],
		},
		metadata: [
			{
				_uid: "abc123",
				component: "metadata",
				description: "This is a sample metadata description.",
				creator: "John Doe",
				additionalField1: "Some extra information",
				additionalField2: 42,
			},
		],
		component: "infoPage",
		isNavigationRoot: false,
		_editable:
			'<!--#storyblok#{"name": "infoPage", "space": "292509", "uid": "4172c380-d200-439f-963a-b093bead4d3c", "id": "551380672"}-->',
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
