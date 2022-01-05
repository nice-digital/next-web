import { Document } from "@nice-digital/search-client";

type SearchResultDocument = Pick<
	Document,
	| "id"
	| "niceDocType"
	| "niceResultType"
	| "publicationDate"
	| "lastUpdated"
	| "pathAndQuery"
	| "resourceType"
	| "subSectionLinks"
	| "title"
>;

const pathwayDoc: SearchResultDocument = {
	id: "1",
	niceDocType: ["NICE Pathways"],
	niceResultType: "NICE Pathway",
	publicationDate: "2021-04-06T12:00:00",
	lastUpdated: "2021-11-24T12:00:00",
	pathAndQuery: "/pathways/test",
	resourceType: ["Test Resource Type"],
	subSectionLinks: "",
	title: "Test pathway",
};

const guidanceDoc: SearchResultDocument = {
	id: "2",
	niceDocType: ["Guidance"],
	niceResultType: "",
	publicationDate: "2021-04-06T12:00:00",
	lastUpdated: "2021-04-06T12:00:00",
	pathAndQuery: "/guidance/test",
	resourceType: ["Test Resource Type"],
	subSectionLinks: "",
	title: "Test title",
};

const uncategorisedDoc: SearchResultDocument = {
	id: "3",
	niceDocType: [],
	niceResultType: "",
	publicationDate: "1970-01-01T12:00:00",
	lastUpdated: null,
	pathAndQuery: "/guidance/test",
	resourceType: [],
	subSectionLinks: "",
	title: "Test title,",
};

const qualityStandardDoc: SearchResultDocument = {
	id: "4",
	niceDocType: [],
	niceResultType: "",
	publicationDate: "2021-04-01T12:00:00",
	lastUpdated: "2021-04-01T12:00:00",
	pathAndQuery: "/qualitystandard/test",
	resourceType: ["Test Resource Type"],
	subSectionLinks:
		'<SubSections>\r\n  <link url="/guidance/qs56">Overview</link>\r\n  <link url="/guidance/qs56/chapter/Introduction">Introduction</link>\r\n  <link url="/guidance/qs56/chapter/List-of-quality-statements">List of quality statements</link>\r\n  <link url="/guidance/qs56/chapter/Quality-statement-1-Information-about-recognising-the-symptoms-of-metastatic-spinal-cord-compression">Quality statement 1: Information about recognising the symptoms of metastatic spinal cord compression</link>\r\n  <link url="/guidance/qs56/chapter/Quality-statement-2-Imaging-and-treatment-plans-for-adults-with-suspected-spinal-metastases">Quality statement 2: Imaging and treatment plans for adults with suspected spinal metastases</link>\r\n  <link url="/guidance/qs56/chapter/Quality-statement-3-Imaging-and-treatment-plans-for-adults-with-suspected-metastatic-spinal-cord-compression">Quality statement 3: Imaging and treatment plans for adults with suspected metastatic spinal cord compression</link>\r\n  <link url="/guidance/qs56/chapter/Quality-statement-4-Coordinating-investigations-for-adults-with-suspected-metastatic-spinal-cord-compression">Quality statement 4: Coordinating investigations for adults with suspected metastatic spinal cord compression</link>\r\n  <link url="/guidance/qs56/chapter/Quality-statement-5-Coordinating-care-for-adults-with-metastatic-spinal-cord-compression">Quality statement 5: Coordinating care for adults with metastatic spinal cord compression</link>\r\n</SubSections>',
	title: "Test quality standard",
};

const guidanceDocMatchingDates: SearchResultDocument = {
	id: "5",
	niceDocType: ["Guidance"],
	niceResultType: "",
	publicationDate: "2021-01-01T12:00:00",
	lastUpdated: "2021-01-01T12:00:00",
	pathAndQuery: "/guidance/test",
	resourceType: ["Test Resource Type"],
	subSectionLinks: "",
	title: "Test title",
};

const unpublishedDoc: SearchResultDocument = {
	id: "6",
	niceDocType: ["Guidance"],
	resourceType: ["Test Resource Type"],
	niceResultType: "NICE guideline",
	pathAndQuery: "",
	publicationDate: null,
	lastUpdated: null,
	subSectionLinks: null,
	title: "<b>test</b> 321",
};

export const mockDocuments: Document[] = [
	pathwayDoc as Document,
	guidanceDoc as Document,
	uncategorisedDoc as Document,
	qualityStandardDoc as Document,
];

export const mockDocumentMatchingDates: Document[] = [
	guidanceDocMatchingDates as Document,
];

export const mockDocumentUnpublished: Document[] = [unpublishedDoc as Document];
