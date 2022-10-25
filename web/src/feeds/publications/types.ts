import type { Except } from "type-fest";

export enum FeedPath {
	ProductsLite = "/feeds/products-lite",
	ProductTypes = "/feeds/producttypes",
	AreasOfInterest = "/feeds/areaofinteresttypes",
	ProductDetail = "/feeds/product/",
}

export enum ProductStatus {
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

interface EmptyLinks {
	/** Empty object that's never used but in here for completeness */
	self: [Record<string, never>];
}

export type BaseFeedItem = {
	links: EmptyLinks;
	/** ETag is always null so kind of pointless but kept here for completeness */
	eTag: null;
	/** Full ISO date string like `2021-04-15T08:18:13.7945978Z` */
	lastModified: string;
};

/**
 * The raw object that comes back from the feed
 */
export type ProductLiteRaw = BaseFeedItem & {
	links: EmptyLinks & {
		nicePublicationsProductFeed: Link[];
	};
	eTag: null;
	id: string;
	title: string;
	productStatus: ProductStatus;
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
	Enabled: boolean;
	Name: string;
	PluralName: string;
};

type ETag = string | null;

// axios-case-converter maps key property names like nice.publications:area-of-interest-type-list to nicePublicationsAreaOfInterestTypeList
type EmbeddedKey = `nicePublications${string}`;

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
	"nicePublicationsAreaOfInterestTypeList",
	"nicePublicationsAreaOfInterestType",
	AreaOfInterest
>;

export type ProductTypeList = FeedContent<
	"nicePublicationsProductTypeList",
	"nicePublicationsProductType",
	ProductType
>;

export type ProductListLite = FeedContent<
	"nicePublicationsProductListLite",
	"nicePublicationsProductLite",
	ProductLiteRaw
>;

export type ProductChapter = {
	title: string;
	url: string;
};

export type HTMLChapterContentInfo = {
	title: string;
	chapterSlug: string;
	links: { self: [Link] };
};

export type HTMLChapterContent = {
	eTag: string;
	content: string;
	title: string;
	reference: string;
	partId: number;
	chapterSlug: string;
};

export type HTMLContent = Embedded<
	"nicePublicationsHtmlChapterContentInfo",
	HTMLChapterContentInfo[]
>;

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
		nicePublicationsHtmlContent: HTMLContent;
		nicePublicationsPdfFile: FileContent<"pdf">;
		nicePublicationsMobiFile: FileContent<"mobi">;
		nicePublicationsEpubFile: FileContent<"epub">;
	};
};

export type ContentPartList = Embedded<
	"nicePublicationsUploadAndConvertContentPart",
	UploadAndConvertContentPart
>;

export type ProductDetail = {
	links: { self: [Link] };
	eTag: string | null;
	id: string;
	lastModified: string;
	productType: ProductTypeAcronym;
	title: string;
	shortTitle: string | null;
	inDevReference: string;
	metaDescription: string;
	summary: string | null;
	productStatus: string;
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
	ipsv: string;
	chapterHeadings: ProductChapter[];
	productTypeName: string;
	productTypeNamePlural: string;
} & Embedded<"nicePublicationsContentPartList", ContentPartList>;

export type ErrorResponse = {
	StatusCode: string;
	Message: string;
};
