import { render } from "@testing-library/react";

import { SoundCloudEmbed } from "./SoundCloudEmbed";

describe("SoundCloud embed component", () => {
	it("should match snapshot", () => {
		const { container } = render(<SoundCloudEmbed id="787280485" />);
		expect(container).toMatchSnapshot();
	});
});
