import dayjs from "dayjs";
import React, {
	ChangeEvent,
	FC,
	InvalidEvent,
	useCallback,
	useEffect,
	useState,
} from "react";
import { Except } from "type-fest";

import { Button } from "@nice-digital/nds-button";
import { FilterGroup } from "@nice-digital/nds-filters";
import { Input } from "@nice-digital/nds-input";

export const isoMinDate = "2000-01-01";

export const isoDateInputFallbackPattern =
	"[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])";

export interface ToFromDateFilters {
	heading?: string;
	to?: string;
	from?: string;
}

export const ToFromDateFilters: FC<ToFromDateFilters> = ({
	heading = "Date",
	to,
	from,
}) => (
	<FilterGroup heading={heading} headingLevel={3}>
		<ToFromDateFiltersBody from={from} to={to} />
	</FilterGroup>
);

// Extra component to avoid the NDS filter group component passing invalid props (groupid/groupheading) into the div
export const ToFromDateFiltersBody: FC<Except<ToFromDateFilters, "heading">> =
	({ to = "", from = "" }) => {
		const [toDate, setToDate] = useState(to),
			[toValid, setToValid] = useState(true),
			[fromDate, setFromDate] = useState(from),
			[fromValid, setFromValid] = useState(true);

		// Support updating input values to reflect reflect changed props, e.g. from navigation etc
		useEffect(() => {
			setFromDate(from);
			setToDate(to);
		}, [from, to]);

		const fromDateChangeHandler = useCallback(
			(e: ChangeEvent<HTMLInputElement>) => {
				setFromDate(e.target.value);

				// We need a from AND to date for the filtering to work
				if (!toDate) {
					setToDate(dayjs().add(1, "day").format("YYYY-MM-DD"));
				}
			},
			[toDate]
		);

		const toDateChangeHandler = useCallback(
			(e: ChangeEvent<HTMLInputElement>) => {
				setToDate(e.target.value);
			},
			[]
		);

		const fromDateInvalidHandler = useCallback(
			(e: InvalidEvent<HTMLInputElement>) => {
				const isValid = !toDate || !!e.currentTarget.value;
				setFromValid(isValid);
				e.currentTarget.setCustomValidity(
					isValid ? "" : "Please enter a from date"
				);
			},
			[toDate]
		);

		const toDateInvalidHandler = useCallback(
			(e: InvalidEvent<HTMLInputElement>) => {
				const isValid = !fromDate || !!e.currentTarget.value;
				setToValid(isValid);
				e.currentTarget.setCustomValidity(
					isValid ? "" : "Please enter a to date"
				);
			},
			[fromDate]
		);

		return (
			<div className="ph--c pt--c">
				<Input
					label="From date"
					name="from"
					type="date"
					pattern={isoDateInputFallbackPattern}
					placeholder="yyyy-mm-dd"
					min={isoMinDate}
					max={dayjs(toDate || undefined).format("YYYY-MM-DD")}
					value={fromDate}
					onChange={fromDateChangeHandler}
					required={!fromDate && !!toDate}
					error={!fromValid}
					errorMessage="Please enter a from date"
					onInvalid={fromDateInvalidHandler}
					onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
						e.target.setCustomValidity("");
						setFromValid(true);
					}}
				/>
				<Input
					label="To date"
					name="to"
					type="date"
					pattern={isoDateInputFallbackPattern}
					placeholder="yyyy-mm-dd"
					min={fromDate || isoMinDate}
					max={dayjs().add(1, "day").format("YYYY-MM-DD")}
					value={toDate}
					onChange={toDateChangeHandler}
					required={!toDate && !!fromDate}
					error={!toValid}
					errorMessage="Please enter a to date"
					onInvalid={toDateInvalidHandler}
					onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
						e.target.setCustomValidity("");
						setToValid(true);
					}}
				/>
				<Button type="submit" variant="secondary" className="ml--0">
					Apply date filters
				</Button>
			</div>
		);
	};
