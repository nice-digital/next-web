/* eslint-disable testing-library/no-node-access */
import { render } from "@testing-library/react";

import {
	FullWidthSection,
	type FullWidthSectionProps,
} from "./FullWidthSection";

describe("FullWidthSection component", () => {
	it("should have the correct default classnames", () => {
		const { container } = render(
			<FullWidthSection>
				<p>test</p>
			</FullWidthSection>
		);
		const section = container.firstChild;
		expect(section).toHaveClass("fullWidth themeSubtle verticalPaddingMedium");
	});

	it.each([
		["subtle", "fullWidth themeSubtle verticalPaddingMedium"],
		["impact", "fullWidth themeImpact verticalPaddingMedium"],
		["transparent", "fullWidth themeTransparent verticalPaddingMedium"],
	])("should have correct classes for theme", (theme, expectedClasses) => {
		const { container } = render(
			<FullWidthSection theme={theme as FullWidthSectionProps["theme"]}>
				<p>test</p>
			</FullWidthSection>
		);

		const section = container.firstChild;
		expect(section).toHaveClass(expectedClasses);
	});

	it.each([
		["small", "fullWidth themeSubtle verticalPaddingSmall"],
		["medium", "fullWidth themeSubtle verticalPaddingMedium"],
		["large", "fullWidth themeSubtle verticalPaddingLarge"],
	])(
		"should have correct classes for theme",
		(verticalPadding, expectedClasses) => {
			const { container } = render(
				<FullWidthSection
					verticalPadding={
						verticalPadding as FullWidthSectionProps["verticalPadding"]
					}
				>
					<p>test</p>
				</FullWidthSection>
			);

			const section = container.firstChild;
			expect(section).toHaveClass(expectedClasses);
		}
	);
});
