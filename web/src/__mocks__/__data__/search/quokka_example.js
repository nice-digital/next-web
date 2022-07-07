// @ts-nocheck
const array = [
	{
		guidance: {
			id: "2",
			niceDocType: ["Guidance"],
			niceResultType: "",
			publicationDate: "2021-04-06T12:00:00",
			lastUpdated: "2021-11-24T12:00:00",
			pathAndQuery: "/guidance/test",
			resourceType: ["Test Resource Type"],
			subSectionLinks: "",
			title: "Test title 2",
		},
		guidanceNonMatchingDates: {
			id: "2",
			niceDocType: ["Guidance"],
			niceResultType: "",
			publicationDate: "2021-04-06T12:00:00",
			lastUpdated: "2021-11-24T12:00:00",
			pathAndQuery: "/guidance/test",
			resourceType: ["Test Resource Type"],
			subSectionLinks: "",
			title: "Test title 2",
		},
		guidanceMatchingDates: {
			id: "5",
			niceDocType: ["Guidance"],
			niceResultType: "",
			publicationDate: "2021-01-01T12:00:00",
			lastUpdated: "2021-01-01T12:00:00",
			pathAndQuery: "/guidance/test",
			resourceType: ["Test Resource Type"],
			subSectionLinks: "",
			title: "Test title",
		},
		uncategorised: {
			id: "3",
			niceDocType: [],
			niceResultType: "",
			publicationDate: "1970-01-01T12:00:00",
			lastUpdated: null,
			pathAndQuery: "/guidance/test",
			resourceType: [],
			subSectionLinks: "",
			title: "Test title,",
		},
		qualityStandard: {
			id: "4",
			niceDocType: [],
			niceResultType: "",
			publicationDate: "2021-04-01T12:00:00",
			lastUpdated: "2021-04-01T12:00:00",
			pathAndQuery: "/qualitystandard/test",
			resourceType: ["Test Resource Type"],
			subSections: [
				{ title: "Overview", url: "/guidance/qs56" },
				{ title: "Introduction", url: "/guidance/qs56/chapter/Introduction" },
				{
					title: "List of quality statements",
					url: "/guidance/qs56/chapter/List-of-quality-statements",
				},
				{
					title:
						"Quality statement 1: Information about recognising the symptoms of metastatic spinal cord compression",
					url: "/guidance/qs56/chapter/Quality-statement-1-Information-about-recognising-the-symptoms-of-metastatic-spinal-cord-compression",
				},
				{
					title:
						"Quality statement 2: Imaging and treatment plans for adults with suspected spinal metastases",
					url: "/guidance/qs56/chapter/Quality-statement-2-Imaging-and-treatment-plans-for-adults-with-suspected-spinal-metastases",
				},
				{
					title:
						"Quality statement 3: Imaging and treatment plans for adults with suspected metastatic spinal cord compression",
					url: "/guidance/qs56/chapter/Quality-statement-3-Imaging-and-treatment-plans-for-adults-with-suspected-metastatic-spinal-cord-compression",
				},
				{
					title:
						"Quality statement 4: Coordinating investigations for adults with suspected metastatic spinal cord compression",
					url: "/guidance/qs56/chapter/Quality-statement-4-Coordinating-investigations-for-adults-with-suspected-metastatic-spinal-cord-compression",
				},
				{
					title:
						"Quality statement 5: Coordinating care for adults with metastatic spinal cord compression",
					url: "/guidance/qs56/chapter/Quality-statement-5-Coordinating-care-for-adults-with-metastatic-spinal-cord-compression",
				},
			],
			title: "Test quality standard",
		},
		unpublished: {
			id: "6",
			niceDocType: ["Guidance"],
			resourceType: ["Test Resource Type"],
			niceResultType: "NICE guideline",
			pathAndQuery: "",
			publicationDate: null,
			lastUpdated: null,
			subSectionLinks: "",
			title: "<b>test</b> 321",
		},
		qualityStandardWithoutSubsections: {
			id: "7",
			niceDocType: [],
			niceResultType: "",
			publicationDate: "2021-04-01T12:00:00",
			lastUpdated: "2021-04-01T12:00:00",
			pathAndQuery: "/qualitystandard/test",
			resourceType: ["Test Resource Type"],
			subSectionLinks: ",,,,,,,,,",
			title: "Test quality standard",
		},
	},
];

array.map((obj) => {
	console.log(obj);
});

const arr = [
	{ user: "dan", liked: "yes", age: "22" },
	{ user: "sarah", liked: "no", age: "21" },
	{ user: "john", liked: "yes", age: "23" },
];
const mapToPair = (arr = []) => {
	const result = arr.map((obj) => {
		const res = {};
		res[obj["user"]] = obj["liked"];
		return res;
	});
	return result;
};
console.log(mapToPair(arr));
