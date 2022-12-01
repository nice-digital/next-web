import { render } from "@testing-library/react";

import { FileSize } from "./FileSize";

describe("FileSize", () => {
	it("should format bytes", () => {
		const { container } = render(<FileSize fileSizeBytes={123} />);

		expect(container).toHaveTextContent("123 B");
	});

	it("should round kilobytes to nearest whole integer", () => {
		const { container } = render(<FileSize fileSizeBytes={1234} />);

		expect(container).toHaveTextContent("1 kB");
	});

	it("should round megabytes to one decimal place", () => {
		const { container } = render(<FileSize fileSizeBytes={1234567} />);

		expect(container).toHaveTextContent("1.2 MB");
	});
});
