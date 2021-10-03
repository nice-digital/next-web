import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { GetServerSidePropsContext } from "next";
import { stringify } from "qs";

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(customParseFormat);

const oldGuidanceTypeKeys = "apg,csg,cg,cov,mpg,ph,sg,sc,dg,hst,ipg,mtg,qs,ta",
	oldAdviceTypeKey = "es,ktt,mib";

/**
 * Mappings of the 'area' querystring in the old Guidance-Web list
 * to 'nai' in the new search list.
 */
const areaOfInterestQueryMappings = {
	amp: "Antimicrobial prescribing",
	cov: "COVID-19",
};

const guidanceTypeQueryMappings = {
	apg: "Antimicrobial+prescribing+guidelines",
	csg: "Cancer service guidelines",
	cg: "Clinical guidelines",
	cov: "COVID-19 rapid guidelines",
	mpg: "Medicines practice guidelines",
	ph: "Public health guidelines",
	sg: "Safe staffing guidelines",
	sc: "Social care guidelines",
	dg: "Diagnostics guidance",
	hst: "Highly specialised technologies guidance",
	ipg: "Interventional procedures guidance",
	mtg: "Medical technologies guidance",
	ta: "Technology appraisal",
};

const adviceTypeQueryMappings = {
	es: "Evidence summaries",
	ktt: "Key therapeutic topics",
	mib: "Medtech innovation briefings",
};

export const getRedirectUrl = ({
	query,
	resolvedUrl,
}: GetServerSidePropsContext): string | null => {
	if (!query) return null;

	const { area, type, title, fromdate, todate } = query as {
		area?: string;
		type?: string;
		title?: string;
		fromdate?: string;
		todate?: string;
	};

	if (!area && !type && !title && !fromdate && !todate) return null;

	const newParams: NodeJS.Dict<string | string[]> = {};

	if (title) newParams["q"] = title;

	if (fromdate) {
		const from = dayjs(fromdate, "MMMM YYYY");

		if (from.isValid()) newParams["from"] = from.format("YYYY-MM-DD");
		else throw new Error(`Date of ${fromdate} could not be parsed`);

		if (!todate) newParams["to"] = dayjs().format("YYYY-MM-DD");
	}

	if (todate) {
		const to = dayjs(todate, "MMMM YYYY");

		if (to.isValid()) newParams["to"] = to.endOf("month").format("YYYY-MM-DD");
		else throw new Error(`Date of ${todate} could not be parsed`);

		if (!fromdate) newParams["from"] = "2000-01-01";
	}

	if (area)
		newParams["nai"] = area
			.split(",")
			.map(
				(a) =>
					areaOfInterestQueryMappings[
						a as keyof typeof areaOfInterestQueryMappings
					]
			)
			.filter(Boolean);

	if (type) {
		const newNDTKeys: string[] = [];

		// Special cases where individual programmes selected together become a type
		if (type.includes(oldGuidanceTypeKeys)) newNDTKeys.push("Guidance");
		if (type.includes(oldAdviceTypeKey)) newNDTKeys.push("Advice");
		if (type.includes("qs")) newNDTKeys.push("Quality standard");

		// Any type params after the above groups are individual programmes
		const programmeKeys = type
			.replace(oldGuidanceTypeKeys, "")
			.replace(oldAdviceTypeKey, "")
			.replace("qs", "")
			.split(",")
			.filter(Boolean);

		newParams["ngt"] = programmeKeys
			.map(
				(a) =>
					guidanceTypeQueryMappings[a as keyof typeof guidanceTypeQueryMappings]
			)
			.filter(Boolean);

		if (newParams["ngt"].length > 0 && !newNDTKeys.includes("Guidance"))
			newNDTKeys.push("Guidance");

		newParams["nat"] = programmeKeys
			.map(
				(a) =>
					adviceTypeQueryMappings[a as keyof typeof adviceTypeQueryMappings]
			)
			.filter(Boolean);

		if (newParams["nat"].length > 0 && !newNDTKeys.includes("Advice"))
			newNDTKeys.push("Advice");

		newParams["ndt"] = newNDTKeys;
	}

	return (
		resolvedUrl.split("?")[0] +
		stringify(newParams, { arrayFormat: "repeat", addQueryPrefix: true })
	);
};
