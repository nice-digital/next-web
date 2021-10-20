import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";

import { render, screen } from "@/test-utils";

import {
	ToFromDateFilters,
	isoMinDate,
	isoDateInputFallbackPattern,
} from "./ToFromDateFilters";

describe("ToFromDateFilters", () => {
	describe.each([
		["To date", "to"],
		["From date", "from"],
	])("%s attributes", (label, name) => {
		beforeEach(() => {
			render(<ToFromDateFilters useFutureDates={false} />);
		});

		it(`should render ${label} input`, () => {
			expect(screen.getByLabelText(label)).toBeInTheDocument();
			expect(screen.getByLabelText(label)).toHaveAttribute("type", "date");
		});

		it(`should render ${name} name attribute on ${label} input`, () => {
			expect(screen.getByLabelText(label)).toHaveAttribute("name", name);
		});

		it(`should render fallback pattern attribute on ${label}`, () => {
			expect(screen.getByLabelText(label)).toHaveAttribute(
				"pattern",
				isoDateInputFallbackPattern
			);
		});

		it(`should render fallback placeholder attribute on ${label}`, () => {
			expect(screen.getByLabelText(label)).toHaveAttribute(
				"placeholder",
				"yyyy-mm-dd"
			);
		});

		it(`should render min date attribute on ${label} when no given dates`, () => {
			expect(screen.getByLabelText(label)).toHaveAttribute("min", isoMinDate);
		});
	});

	describe("Initial values", () => {
		it("should set initial 'to date' attribute from given 'to' prop", () => {
			render(<ToFromDateFilters useFutureDates={false} to="1856-07-10" />);

			expect(screen.getByLabelText("To date")).toHaveValue("1856-07-10");
		});

		it("should set initial 'from date' attribute from given 'from' prop", () => {
			render(<ToFromDateFilters useFutureDates={false} from="1867-11-07" />);

			expect(screen.getByLabelText("From date")).toHaveValue("1867-11-07");
		});

		it("should set empty 'to date' field to today when 'from date' is set", () => {
			render(<ToFromDateFilters useFutureDates={false} />);

			expect(screen.getByLabelText("To date")).toHaveValue("");

			userEvent.type(screen.getByLabelText("From date"), "1912-06-23");

			expect(screen.getByLabelText("To date")).toHaveValue(
				dayjs().format("YYYY-MM-DD")
			);
		});
	});

	describe("Min and max", () => {
		describe("Using past dates", () => {
			it(`should set max 'from date' as today when no given 'to date' and using past dates`, () => {
				render(<ToFromDateFilters useFutureDates={false} />);

				expect(screen.getByLabelText("From date")).toHaveAttribute(
					"max",
					dayjs().format("YYYY-MM-DD")
				);
			});

			it(`should set max 'from date' using given 'to date'`, () => {
				render(<ToFromDateFilters useFutureDates={false} to="1858-07-15" />); // <-- look up the date

				expect(screen.getByLabelText("From date")).toHaveAttribute(
					"max",
					"1858-07-15"
				);
			});

			it(`should set min 'to date' using given 'from date'`, () => {
				render(<ToFromDateFilters useFutureDates={false} from="1858-07-15" />);

				expect(screen.getByLabelText("To date")).toHaveAttribute(
					"min",
					"1858-07-15"
				);
			});

			it(`should set max 'to date' as today when using past dates`, () => {
				render(<ToFromDateFilters useFutureDates={false} />);

				expect(screen.getByLabelText("To date")).toHaveAttribute(
					"max",
					dayjs().format("YYYY-MM-DD")
				);
			});
		});

		describe("Using future dates", () => {
			it(`should set min 'from date' as today when using future dates`, () => {
				render(<ToFromDateFilters useFutureDates={true} />);

				expect(screen.getByLabelText("From date")).toHaveAttribute(
					"min",
					dayjs().format("YYYY-MM-DD")
				);
			});

			it(`should set max 'from date' as 10 years from now when using future dates`, () => {
				render(<ToFromDateFilters useFutureDates={true} />);

				expect(screen.getByLabelText("From date")).toHaveAttribute(
					"max",
					dayjs().add(10, "y").format("YYYY-MM-DD")
				);
			});

			it(`should set max 'from date' using given 'to date'`, () => {
				render(<ToFromDateFilters useFutureDates={true} to="1858-07-15" />); // <-- look up the date

				expect(screen.getByLabelText("From date")).toHaveAttribute(
					"max",
					"1858-07-15"
				);
			});

			it(`should set min 'to date' using given 'from date'`, () => {
				render(<ToFromDateFilters useFutureDates={true} from="1858-07-15" />);

				expect(screen.getByLabelText("To date")).toHaveAttribute(
					"min",
					"1858-07-15"
				);
			});

			it(`should set min 'to date' as today when using future dates`, () => {
				render(<ToFromDateFilters useFutureDates={true} />);

				expect(screen.getByLabelText("To date")).toHaveAttribute(
					"min",
					dayjs().format("YYYY-MM-DD")
				);
			});

			it(`should set max 'to date' as 10 years from now when using future dates`, () => {
				render(<ToFromDateFilters useFutureDates={true} />);

				expect(screen.getByLabelText("To date")).toHaveAttribute(
					"max",
					dayjs().add(10, "y").format("YYYY-MM-DD")
				);
			});
		});
	});

	describe("Validation", () => {
		it.each([
			["From date", "To date"],
			["To date", "From date"],
		])(
			"should make '%s' required when '%s' has a value",
			(requiredDate, inputtedDate) => {
				render(<ToFromDateFilters useFutureDates={false} />);

				expect(screen.getByLabelText(requiredDate)).not.toHaveAttribute(
					"required"
				);

				userEvent.type(screen.getByLabelText(inputtedDate), "1912-06-23");
				userEvent.clear(screen.getByLabelText(requiredDate));

				expect(screen.getByLabelText(requiredDate)).toHaveAttribute(
					"required",
					""
				);
			}
		);
	});
});
