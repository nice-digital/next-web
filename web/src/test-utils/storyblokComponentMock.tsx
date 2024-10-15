// test mocking the StoryblokComponent
jest.mock("@storyblok/react", () => ({
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	StoryblokComponent: ({ blok }: { blok: any }) => {
		return (
			<div data-testid={`storyblok-component-${blok.component}`}>
				{blok.component}
			</div>
		);
	},
}));
