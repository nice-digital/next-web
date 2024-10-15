/* eslint-disable testing-library/no-node-access */
import { render } from "@testing-library/react";

import {
	StoryblokFullWidthSection,
	type StoryblokFullWidthSectionProps,
} from "./StoryblokFullWidthSection";

describe("Storyblok action banner component", () => {
	it("should match snapshot", () => {
		const { container } = render(<StoryblokFullWidthSection />);
		expect(container).toMatchSnapshot();
	});
});
