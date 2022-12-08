import { ProductGroup, ProductTypeAcronym } from "@/feeds/publications/types";

export enum FeedPath {
	AllProjects = "/gidprojects/all",
	InConsultationProjects = "/inconsultationprojects",
	ProjectDetail = "/project/",
}

export enum ProjectStatus {
	"Complete" = "Complete",
	"Discontinued" = "Discontinued",
	"Suspended" = "Suspended",
	"Referred" = "Referred",
	"InProgress" = "InProgress",
	"Proposed" = "Proposed",
	"TopicSelection" = "TopicSelection",
	"ImpactedByCOVID19" = "ImpactedByCOVID19",
}

/** Not a definitive list - this may change over time */
export enum ProjectProcess {
	"MTA" = "MTA",
	"IP" = "IP",
	"TAG" = "TAG",
	"MT" = "MT",
	"DT" = "DT",
	"STAPre2018" = "STA pre-2018",
	"STA2018" = "STA 2018",
	"QSD" = "QSD",
	"CG" = "CG",
	"APG" = "APG",
	"SG" = "SG",
	"HST" = "HST",
	"MIB" = "MIB",
	"STAReview" = "STA Review",
	"PHG" = "PHG",
	"MTAReview" = "MTA Review",
	"CDFReview" = "CDF Review",
	"NG" = "NG",
	"APA" = "APA",
	"ES" = "ES",
	"SC" = "SC",
	"COVID19RapidGuideline" = "COVID-19 rapid guideline",
}

export type ProjectGroup = ProductGroup.Guidance | ProductGroup.Advice;

export type GIDReference = `GID-${Uppercase<string>}${number}`;

export interface AllProjects {
	links: {
		// In theory InDev supports pagination, but in reality the gidprojects/all feed always returns all projects and a page size of 2048
		first: [
			{
				href: "/gidprojects/All?Page=0&PageSize=2048";
			}
		];
		last: [
			{
				// This looks like a bug in InDev as Page=0
				href: "/gidprojects/All?Page=0&PageSize=2048";
			}
		];
		self: [
			{
				href: "/gidprojects/All?Page=0&PageSize=2048";
			}
		];
	};
	embedded: {
		niceIndevIndevelopmentProject: Project[];
	};
}

export interface Project {
	links: {
		self: [
			{
				href: `/project/${GIDReference}`;
			}
		];
	};
	/** e.g. 01000000-0000-001B-0000-000000005402 */
	eTag: string;
	/** Project reference e.g. GID-TAG377 */
	reference: GIDReference;
	/** Acronym (usually 2 or 3 letters) for the type of the project e.g "TA", "IPG" etc */
	projectType: ProductTypeAcronym;
	/** The name of the project type e.g. "Technology appraisal guidance" for TA or "Interventional procedures guidance" for "IPG" */
	productTypeName: string;
	process: ProjectProcess | string;
	/** Project title e.g. "Atrial fibrillation - ximelagatran [ID376]" or "Clinically isolated syndrome - beta interferons and glatiramer acetate [ID109]" */
	title: string;
	status: ProjectStatus;
	projectGroup: ProjectGroup;
	/**
	 * `null` for unpublished projects or an ISO formatted date string like `2020-12-15T00:00:00`
	 */
	publishedDate: string | null;
	/**
	 * An ISO formatted date string like `2020-09-22T13:51:48.8447645`
	 */
	lastModifiedDate: string;
	/**
	 * Null for unpublished projects or an ISO formatted date string like `2020-10-05T12:27:21.5437767`
	 */
	firstGoLiveDate: string | null;
	/** The date the project was created in in dev */
	createdDate: string;
	developedAs: string | null;
	/** Almost always the same as `DevelopedAs` */
	relevantTo: string | null;
	idNumber: `${number}` | null;
	/** E.g. "BMJ Evidence Centre, BMJ Group", "ScHARR" or "Warwick Evidence" etc */
	evidenceAssessmentGroup: string | null;
	/** TODO Always seems to be an empty array */
	areasOfInterestList: [];
}

export interface InConsultationProjects {
	links: {
		self: [
			{
				href: "/inconsultationprojects?Page=0&PageSize=2048";
			}
		];
	};
	// Sometimes there are no consultations running, in which case `_embedded` is not in the feed at all
	embedded?: {
		niceIndevInconsultationProduct: Consultation[];
	};
	eTag: null;
	// Page and size is hard coded here
	page: 0;
	pageSize: 2048;
	totalItems: number;
}

export interface Consultation {
	_links: {
		self: [
			{
				href: `/guidance/${GIDReference}/consultation/html-content${
					| number
					| ""}`;
			}
		];
	};
	eTag: null;
	reference: GIDReference;
	title: string;
	consultationName: string;
	/** ISO formatted date like `2021-06-18T00:00:00` */
	startDate: string;
	/** ISO formatted date like `2021-06-18T00:00:00` */
	endDate: string;
	consultationType: string;
	resourceTitleId: string;
	projectType: ProjectProcess | string;
	productTypeName: string;
	showExpressionOfInterestSubmissionQuestion: boolean;
	developedAs: null;
	relevantTo: null;
	consultationId: number;
	/** E.g. QSD, IP etc */
	process: string;
	hasDocumentsWhichAllowConsultationComments: boolean;
	isCHTE: boolean;
	/** E.g. HSCTeam or CHTETeam */
	allowedRole: string;
	firstConvertedDocumentId: null;
	firstChapterSlugOfFirstConvertedDocument: null;
	partiallyUpdatedProjectReference: null;
	origProjectReference: null;
	areasOfInterestList: [];
}

export type Link = {
	href: string;
};

type ETag = string | null;

export type IndevFile = {
	links: {
		self: [Link];
	};
	eTag: ETag;
	id: string;
	mimeType: string;
	fileName: string;
	length: number;
	hash: string;
	name: string;
	reference: string;
	resourceTitleId: string;
	consultationDocumentId: number;
};

export type IndevResource = {
	links: {
		self: [Link];
	};
	embedded: {
		niceIndevFile: IndevFile;
	};
	eTag: ETag;
	title: string;
	level: number;
	publishedDate: string;
	externalUrl: string | null;
	showInDocList: boolean;
	textOnly: boolean;
	consultationId: number;
	consultationDocumentId: number;
	isCurrentViewableConsultationMarkup: boolean;
	convertedDocument: boolean;
	supportsComments: boolean;
};

export type IndevPanel = {
	links: {
		self: [Link];
	};
	embedded: {
		niceIndevResourceList: {
			links: {
				self: [Link];
			};
			embedded: {
				niceIndevResource: IndevResource | IndevResource[];
			};
			eTag: ETag;
			hasResources: boolean;
		};
	};
	eTag: ETag;
	title: string;
	panelType: string;
	legacyPanel: boolean;
	originalReference: string | null;
	updateReference: string | null;
	showPanel: boolean;
};

export type IndevTimeline = {
	links: {
		self: [Link];
	};
	eTag: ETag;
	column1: string;
	column2: string;
	additionalInfoLabel: string;
	additionalInfo: string;
	hidden: boolean;
};

export type IndevProjectTeam = {
	links: {
		self: [Link];
	};
	eTag: ETag;
	column1: string;
	column2: string;
};

export type IndevEmailEnquiry = {
	links: {
		self: [Link];
	};
	eTag: ETag;
	item: string;
};

export type IndevProcessHomepage = {
	links: {
		self: [Link];
	};
	etag: ETag;
	description: string;
	linkText: string;
} | null;

export type IndevSchedule = {
	links: {
		self: [Link];
	};
	etag: ETag;
	column1: string;
	column2: string;
	additionalInfoLabel: string;
	additionalInfo: string;
	hidden: boolean;
};

export type NiceIndevProvisionalScheduleList = {
	links: {
		self: [Link];
	};
	embedded: {
		niceIndevProvisionalSchedule: IndevSchedule | IndevSchedule[];
	};
	etag: ETag;
};

export type NiceIndevTimelineList = {
	links: {
		self: [Link];
	};
	embedded: {
		niceIndevTimeline: IndevTimeline | IndevTimeline[];
	};
};

export type NiceIndevProjectTeamList = {
	links: {
		self: [Link];
	};
	embedded: {
		niceIndevProjectTeam: IndevProjectTeam | IndevProjectTeam[];
	};
};

export type NiceIndevEmailEnquiryList = {
	links: {
		self: [Link];
	};
	embedded: {
		niceIndevEmailEnquiry: IndevEmailEnquiry | IndevEmailEnquiry[];
	};
};

export type ProjectDetail = {
	links: {
		niceIndevStakeholderRegistration: Record<string, unknown>[];
		self: [Link];
	};
	embedded: {
		niceIndevPanelList: {
			links: {
				self: [Link];
			};
			embedded: {
				niceIndevPanel: IndevPanel[];
			};
		};
		niceIndevProvisionalScheduleList?: NiceIndevProvisionalScheduleList;
		niceIndevTimelineList?: NiceIndevTimelineList;
		niceIndevProcessHomepage?: IndevProcessHomepage;
		niceIndevProjectTeamList?: NiceIndevProjectTeamList;
		niceIndevEmailEnquiryList?: NiceIndevEmailEnquiryList;
	};
	eTag: ETag;
	summary: string | null;
	description: string | null;
	referralDate: string | null;
	suspendDiscontinuedReason: string | null;
	suspendDiscontinuedUrl: string | null;
	suspendDiscontinuedUrlText: string | null;
	legacyModel: boolean;
	productReference: string | null;
	evidenceAssessmentGroup: string | null;
	reference: string;
	projectType: string | null;
	technologyType: string | null;
	productTypeName: string | null;
	process: string;
	title: string;
	status: string;
	projectGroup: string;
	publishedDate: string;
	lastModifiedDate: string;
	firstGoLiveDate: string;
	createdDate: string;
	developedAs: string;
	relevantTo: string | null;
	idNumber: string | null;
	areasOfInterestList: [];
	topicSelectionDecision: string;
	topicSelectionReason: string | null;
	topicSelectionDecisionDate: string | null;
	topicSelectionFurtherInfo: string | null;
	indicatorSubTypes: [];
};
