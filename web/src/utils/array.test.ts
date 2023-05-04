import { arrayify, byTitleAlphabetically, isTruthy } from "./array";

describe("array utils", () => {
	describe("isTruthy", () => {
		it("should return false for undefined value", () => {
			expect(isTruthy(undefined)).toBe(false);
		});

		it("should return false for null value", () => {
			expect(isTruthy(null)).toBe(false);
		});

		it("should return false for empty string value", () => {
			expect(isTruthy(null)).toBe(false);
		});

		it("should return true for string value", () => {
			expect(isTruthy("a")).toBe(true);
		});

		it("should return true for object value", () => {
			expect(isTruthy({ a: 1 })).toBe(true);
		});

		it("should return true for array value", () => {
			expect(isTruthy([])).toBe(true);
		});
	});

	describe("arrayify", () => {
		it("should return empty array from falsey value", () => {
			expect(arrayify(undefined)).toStrictEqual([]);
		});

		it("should return array from single object", () => {
			const object = {
				a: 1,
			};
			expect(arrayify(object)).toStrictEqual([object]);
		});

		it("should return array as-is from given array", () => {
			const object = {
				a: 1,
			};
			expect(arrayify([object])).toStrictEqual([object]);
		});
	});

	describe("byTitleAlphabetically", () => {
		it("should return positive one for reverse alphabetical order", () => {
			expect(byTitleAlphabetically({ title: "b" }, { title: "a" })).toBe(1);
		});

		it("should return negative one for alphabetical order", () => {
			expect(byTitleAlphabetically({ title: "a" }, { title: "b" })).toBe(-1);
		});

		it("should return zero for indentical strings", () => {
			expect(byTitleAlphabetically({ title: "a" }, { title: "a" })).toBe(0);
		});
	});
});
