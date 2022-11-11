import type { Except } from "type-fest";

export enum FeedPath {
	ProductsLite = "/feeds/products-lite",
	ProductTypes = "/feeds/producttypes",
	AreasOfInterest = "/feeds/areaofinteresttypes",
	IndicatorSubTypes = "/feeds/indicatorsubtypes",
	ProductDetail = "/feeds/product/",
}

export enum Status {
	Published = "Published",
	Withdrawn = "Withdrawn",
}

export enum ProductGroup {
	Guideline = "Guideline",
	Guidance = "Guidance",
	Advice = "Advice",
	Standard = "Standard",
	Corporate = "Corporate",
	Other = "Other",
}

export const enum ProductTypeAcronym {
	/** Antimicrobial prescribing evidence summaries */
	"APA" = "APA",
	/** Antimicrobial prescribing guidelines */
	"APG" = "APG",
	/** Clinical guidelines */
	"CG" = "CG",
	/** COVID-19 rapid evidence summaries */
	"COA" = "COA",
	/** COVID-19 rapid guidelines */
	"COV" = "COV",
	/** COVID-19 rapid MIBs */
	"COVM" = "COVM",
	/** COVID-19 tests */
	"COVT" = "COVT",
	/** Cancer service guidelines */
	"CSG" = "CSG",
	/** Diagnostics guidance */
	"DG" = "DG",
	/** Corporate documents (corporate)  */
	"ECD" = "ECD",
	/** Evidence summaries (advice) */
	"ES" = "ES",
	/** Highly specialised technologies guidance */
	"HST" = "HST",
	/** Indicators */
	"IND" = "IND",
	/** Interventional procedures guidance */
	"IPG" = "IPG",
	/** Key therapeutic topics (advice) */
	"KTT" = "KTT",
	/** Local government briefing (advice) */
	"LGB" = "LGB",
	/** Medtech innovation briefings (advice) */
	"MIB" = "MIB",
	/** Medicines practice guidelines */
	"MPG" = "MPG",
	/** Medical technologies guidance */
	"MTG" = "MTG",
	/** NICE guidelines */
	"NG" = "NG",
	/** Public health guidelines */
	"PH" = "PH",
	/** Public involvement programmes (advice) */
	"PIP" = "PIP",
	/** Process and methods guides (corporate) */
	"PMG" = "PMG",
	/** Patient safety guidance */
	"PSG" = "PSG",
	/** Quality standards (standards) */
	"QS" = "QS",
	/** Social care guidelines */
	"SC" = "SC",
	/** Safe staffing guidelines */
	"SG" = "SG",
	/** Technology appraisal guidance */
	"TA" = "TA",
}

export enum AreaOfInterestAcronym {
	/**
	 * Covid-19
	 */
	COV = "COV",
	/**
	 * Antimicrobial prescribing
	 */
	AMP = "AMP",
}

/** Some product types can act as parents for sub-types */
export type ParentProductTypeAcronym =
	// ES (Evidence summaries) have sub types like APA (Antimicrobial prescribing evidence summaries) and COA (COVID-19 rapid evidence summaries)
	| ProductTypeAcronym.ES
	// MIBs (Medtech innovation briefings) have sub types like COA (COVID-19 rapid MIBs) and COVT (COVID-19 tests)
	| ProductTypeAcronym.MIB;

/** Only certain types can be used for 'developed as' */
export type DevelopedAsProductTypeAcronym =
	| ProductTypeAcronym.APA
	| ProductTypeAcronym.APG
	| ProductTypeAcronym.CG
	| ProductTypeAcronym.COA
	| ProductTypeAcronym.COV
	| ProductTypeAcronym.COVM
	| ProductTypeAcronym.MPG
	| ProductTypeAcronym.PH
	| ProductTypeAcronym.SC
	| ProductTypeAcronym.SG;

/** Only certain types can be used for 'relevant to' */
export type RelevantToProductTypeAcronym =
	| ProductTypeAcronym.APA
	| ProductTypeAcronym.APG
	| ProductTypeAcronym.COV
	| ProductTypeAcronym.CSG
	| ProductTypeAcronym.MPG
	| ProductTypeAcronym.PH
	| ProductTypeAcronym.SC
	| ProductTypeAcronym.SG;

export type Link = {
	href: string;
};

type ETag = string | null;

interface EmptySelfLinks {
	/** Empty object that's never used but in here for completeness */
	self: [Record<string, never>];
}

export type BaseFeedItem = {
	links: EmptySelfLinks;
	eTag: ETag;
	/** Full ISO date string like `2021-04-15T08:18:13.7945978Z` */
	lastModified: string;
};

/**
 * The raw object that comes back from the feed
 */
export type ProductLiteRaw = BaseFeedItem & {
	links: EmptySelfLinks & {
		productFeed: Link[];
	};
	eTag: ETag;
	id: string;
	title: string;
	productStatus: Status;
	productType: ProductTypeAcronym;
	/** ISO date string like `2017-07-06T00:00:00`. Notice it's a rounded time because it's set manually by an editor. */
	publishedDate: string;
	/** ISO date string like `2017-07-06T00:00:00` or `2021-05-21T10:54:52.4655487`. */
	lastMajorModificationDate: string;
	areasOfInterestList: AreaOfInterestAcronym[];
	developedAs: DevelopedAsProductTypeAcronym | null;
	relevantTo: RelevantToProductTypeAcronym[];
	productGroup: ProductGroup;
};

/** A product lite from the feed, but with redundant properties removed */
export type ProductLite = Except<ProductLiteRaw, "eTag" | "links">;

export type ProductType = BaseFeedItem & {
	enabled: boolean;
	name: string;
	pluralName: string;
	identifierPrefix: ProductTypeAcronym;
	group: ProductGroup;
	parent: ParentProductTypeAcronym | "";
};

export type AreaOfInterest = BaseFeedItem & {
	enabled: boolean;
	name: string;
	pluralName: string;
	identifierPrefix: string;
};

export type IndicatorSubType = AreaOfInterest;

// axios-case-converter maps key property names like nice.publications:area-of-interest-type-list to areaOfInterestTypeList
type EmbeddedKey = `${string}`;

type Embedded<TKey extends EmbeddedKey, TInner> = {
	embedded: { [key in TKey]: TInner };
};

type FeedContentInner<TEmbeddedInner extends EmbeddedKey, TItemType> = {
	links: {
		self: [Link];
	};
	eTag: ETag;
} & Embedded<TEmbeddedInner, TItemType[]>;

type FeedContent<
	TEmbeddedOuter extends EmbeddedKey,
	TEmbeddedInner extends EmbeddedKey,
	TItemType
> = {
	links: {
		self: [Link];
	};
	eTag: ETag;
	lastModified: string;
} & Embedded<TEmbeddedOuter, FeedContentInner<TEmbeddedInner, TItemType>>;

export type AreasOfInterestList = FeedContent<
	"areaOfInterestTypeList",
	"areaOfInterestType",
	AreaOfInterest
>;

export type ProductTypeList = FeedContent<
	"productTypeList",
	"productType",
	ProductType
>;

export type ProductListLite = FeedContent<
	"productListLite",
	"productLite",
	ProductLiteRaw
>;

export type IndicatorSubTypesList = FeedContent<
	"indicatorSubTypeList",
	"indicatorSubType",
	IndicatorSubType
>;

export type ChapterHeading = {
	title: string;
	url: string;
};

export type HTMLContent = Embedded<
	"htmlChapterContentInfo",
	HTMLChapterContentInfo[]
>;

export type HTMLChapterContentInfo = {
	links: { self: [Link] };
	eTag: ETag;
	title: string;
	reference: string;
	partId: number;
	chapterSlug: string;
};

export type FileContent<TFileExtension extends "pdf" | "mobi" | "epub"> = {
	fileName: `${string}.${TFileExtension}`;
	length: number;
	links: { self: [Link] };
	eTag: string | null;
	uid: number;
	id: string;
	mimeType: string;
	hash: string;
	name: string;
};

export type UploadAndConvertContentPart = {
	embedded: {
		htmlContent: HTMLContent;
		pdfFile: FileContent<"pdf">;
		mobiFile: FileContent<"mobi">;
		epubFile: FileContent<"epub">;
	};
};

export type ContentPartList = {
	embedded: {
		uploadAndConvertContentPart?:
			| UploadAndConvertContentPart
			| UploadAndConvertContentPart[];
	};
};

export type RelatedResourceList = {
	links: EmptySelfLinks;
	embedded: {
		relatedResource: RelatedResource | RelatedResource[];
	};
	eTag: ETag;
};

export type RelatedResource = {
	links: {
		self: [Link, Record<string, never>];
		relatedResourceUri: [Link];
	};
	embedded: {
		resourceGroupList: ResourceGroupList;
	};
	eTag: ETag;
	title: string;
	resourceType: ResourceType;
	status: Status;
	language: "English" | "Welsh";
	uid: number;
};

export type ResourceGroupList = {
	links: EmptySelfLinks;
	embedded: {
		resourceGroup: ResourceGroup;
	};
	eTag: ETag;
};

export type ResourceGroup = {
	links: EmptySelfLinks;
	name: ResourceGroupType;
	eTag: ETag;
};

export enum ResourceGroupType {
	AuditAndServiceImprovement = "AuditAndServiceImprovement",
	ClinicalClassification = "ClinicalClassification",
	CommissioningSupport = "CommissioningSupport",
	DecisionAids = "DecisionAids",
	Education = "Education",
	Evidence = "Evidence",
	ImplementationSupport = "ImplementationSupport",
	InformationForThePublic = "InformationForThePublic",
	ResourceImpact = "ResourceImpact",
	SummaryVersions = "SummaryVersions",
	Unknown = "Unknown",
	ServiceImprovementAndAudit = "ServiceImprovementAndAudit",
	ResourceImpactAssessment = "ResourceImpactAssessment",
	EducationAndLearning = "EducationAndLearning",
	Commissioning = "Commissioning",
	LocalGovernmentBriefing = "LocalGovernmentBriefing",
}

export enum ResourceType {
	AuditAndServiceImprovement = "AuditAndServiceImprovement",
	CaseStudies = "CaseStudies",
	ClinicalClassification = "ClinicalClassification",
	CommissionedResearchAndReports = "CommissionedResearchAndReports",
	CommissioningSupport = "CommissioningSupport",
	DecisionAids = "DecisionAids",
	EconomicAnalysis = "EconomicAnalysis",
	Education = "Education",
	EpidemiologyReview = "EpidemiologyReview",
	EqualityImpactAssessment = "EqualityImpactAssessment",
	EvaluationReport = "EvaluationReport",
	EvidenceReview = "EvidenceReview",
	EvidenceStatement = "EvidenceStatement",
	EvidenceUpdate = "EvidenceUpdate",
	ExpertReports = "ExpertReports",
	Fieldwork = "Fieldwork",
	FullGuidance = "FullGuidance",
	ImplementationSupport = "ImplementationSupport",
	InformationForThePublic = "InformationForThePublic",
	InformationForThePublicLargePrint = "InformationForThePublicLargePrint",
	OtherSupportingEvidence = "OtherSupportingEvidence",
	Overview = "Overview",
	ResourceImpact = "ResourceImpact",
	ReviewDecision = "ReviewDecision",
	SpecialistAdviserQuestionnaires = "SpecialistAdviserQuestionnaires",
	SummaryOfPatientCommentary = "SummaryOfPatientCommentary",
	SummaryVersions = "SummaryVersions",
	SurveillanceReport = "SurveillanceReport",
	Unknown = "Unknown",
	BusinessCase = "BusinessCase",
	LocalGovernmentBriefing = "LocalGovernmentBriefing",
	NewsPodcast = "NewsPodcast",
	SearchStrategies = "SearchStrategies",
	ServiceSpecification = "ServiceSpecification",
	HealthEconomicPlan = "HealthEconomicPlan",
	AssessmentReport = "AssessmentReport",
	AcademicDetailingAid = "AcademicDetailingAid",
	ActionPlanningTool = "ActionPlanningTool",
	AdoptionPack = "AdoptionPack",
	BaselineAssessment = "BaselineAssessment",
	CarePathway = "CarePathway",
	CarePlan = "CarePlan",
	CaseScenario = "CaseScenario",
	Checklist = "Checklist",
	ClinicalAudit = "ClinicalAudit",
	CommissioningFactsheet = "CommissioningFactsheet",
	CommissioningGuide = "CommissioningGuide",
	CostingReport = "CostingReport",
	CostingStatement = "CostingStatement",
	CostingTemplate = "CostingTemplate",
	DataCollectionTool = "DataCollectionTool",
	EducationalResource = "EducationalResource",
	EffectiveInterventionsLibrary = "EffectiveInterventionsLibrary",
	ELearningModules = "ELearningModules",
	Factsheet = "Factsheet",
	FAQs = "FAQs",
	HealthTechnologyAdoptionProgramme = "HealthTechnologyAdoptionProgramme",
	ImplementationAdvice = "ImplementationAdvice",
	ImplementationBriefing = "ImplementationBriefing",
	ImplementationPack = "ImplementationPack",
	ImplementationPodcast = "ImplementationPodcast",
	InformationTemplate = "InformationTemplate",
	LearningPodcast = "LearningPodcast",
	QandADocument = "QandADocument",
	Questionnaire = "Questionnaire",
	ResearchInProgress = "ResearchInProgress",
	ResourceImpactTool = "ResourceImpactTool",
	ROITool = "ROITool",
	SiteDemonstratorPack = "SiteDemonstratorPack",
	SlideSet = "SlideSet",
	SupportForCommissioning = "SupportForCommissioning",
	TailoredCommissioningSupport = "TailoredCommissioningSupport",
	TailoredEducationSupport = "TailoredEducationSupport",
	TailoredServiceImprovementSupport = "TailoredServiceImprovementSupport",
	GuideToResources = "GuideToResources",
}

export type RelatedProductList = {
	links: EmptySelfLinks;
	embedded: {
		relatedProduct: RelatedProduct | RelatedProduct[];
	};
	eTag: ETag;
};

export type RelatedProduct = {
	links: EmptySelfLinks & {
		relatedProductUri: [Link];
	};
	embedded: ProductRelationshipList;
	eTag: ETag;
	title: string;
	shortTitle: string;
	id: string;
};

export type ProductRelationshipList = {
	links: EmptySelfLinks;
	embedded: ProductRelationship;
	eTag: ETag;
};

export type ProductRelationship = {
	links: EmptySelfLinks;
	eTag: ETag;
	relation: RelationshipType;
};

/** Describes how one product might be related to another */
export enum RelationshipType {
	Replaces = "Replaces",
	IsReplacedBy = "IsReplacedBy",
	PartiallyReplaces = "PartiallyReplaces",
	IsPartiallyReplacedBy = "IsPartiallyReplacedBy",
	ReadInConjunctionWith = "ReadInConjunctionWith",
	IsBasedOn = "IsBasedOn",
	IsTheBasisOf = "IsTheBasisOf",
}

export type ProductDetail = {
	links: { self: [Link] };
	embedded: {
		contentPartList?: ContentPartList;
		relatedResourceList?: RelatedResourceList;
		relatedProductList?: RelatedProductList;
	};
	eTag: ETag;
	/** The product id e.g. `CG124` */
	id: string;
	/**
	 * An ISO date string of the time the record was last modified, e.g. `2022-05-05T08:58:37.5476922Z`.
	 *
	 * This date will change for minor edits, e.g. spelling mistakes.
	 * Not to be confused with `lastMajorModificationDate` which represents a 'version' of the product.
	 */
	lastModified: string;
	/** The capitalised acronym for the product type e.g. `CG` or `IND` etc */
	productType: ProductTypeAcronym;
	title: string;
	shortTitle: string | null;
	/** E.g. `CG/Wave18/51` */
	inDevReference: string;
	metaDescription: string;
	summary: string | null;
	productStatus: Status;
	versionNumber: number;
	publishedDate: string;
	lastMajorModificationDate: string;
	majorChangeDate: string | null;
	nextReviewDate: string | null;
	collectionTypesList: [];
	authorList: string[];
	publisherList: string[];
	audienceList: string[];
	estimatedSavings: string;
	estimatedSavingsDescription: string | null;
	estimatedSavingsImpact: null;
	developedAs: string | null;
	relevantTo: string[];
	terminatedAppraisal: null;
	areasOfInterestList: AreaOfInterest[];
	indicatorSubTypeList: string[];
	indicatorOldCode: string;
	indicatorOldUrl: string;
	/** The name of the Integrated Public Sector Vocabulary concept e.g. "Health, well-being and care" */
	iPSV: string;
	/**
	 * The list of chapter titles and URLs.
	 *
	 * @deprecated The URLs in the `chapterHeadings` array are wrong and slugified incorrectly. Use the HTML chapter content info inside upload and convert parts instead
	 */
	chapterHeadings: ChapterHeading[];
	/** The singular name of the product type e.g. "NICE indicator" */
	productTypeName: string;
	/** The plural name of the product type e.g. "NICE indicators" */
	productTypeNamePlural: string;
};

/** The type of the response from a chapter endpoint e.g. /feeds/product/ind69/part/1/chapter/overview */
export type ChapterHTMLContent = {
	links: EmptySelfLinks;
	eTag: ETag;
	/** The HTML content of this chapter */
	content: string;
	embedded?: {
		/** Publications returns either a single object or an array of objects */
		htmlChapterSectionInfo: HTMLChapterSectionInfo | HTMLChapterSectionInfo[];
	};
};

export type HTMLChapterSectionInfo = {
	links: EmptySelfLinks;
	eTag: string;
	reference: string;
	partId: number;
	chapterSlug: string;
	title: string;
};

export type ErrorResponse = {
	statusCode: string;
	message: string;
};
