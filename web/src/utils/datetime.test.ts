import { stripTime, formatDateStr } from "./datetime";

describe("utils", () => {
	describe("stripTime", () => {
		it("should strip time from ISO formatted string", () => {
			expect(stripTime("2020-10-05T12:27:21.5437767")).toBe("2020-10-05");
		});
	});

	describe("formatDateStr", () => {
		it("should format ISO date string as NICE formatted date string", () => {
			expect(formatDateStr("2020-10-05T12:27:21.5437767")).toBe(
				"5 October 2020"
			);
		});
		it("should format ISO date string as NICE formatted date string (short version)", () => {
			expect(formatDateStr("2020-10-05T12:27:21.5437767", true)).toBe(
				"5/10/2020"
			);
		});
	});
});
