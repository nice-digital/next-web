import { toTitleCase } from "./string";

describe("utils", () => {
	describe("toTitleCase", () => {
		it("change mixed case string to title case string", () => {
			expect(toTitleCase("hElLo WoRlD")).toBe("Hello World");
		});
	});
});
