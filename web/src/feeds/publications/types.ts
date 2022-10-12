import type { Except, ReadonlyDeep } from "type-fest";

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
	readonly href: string;
};

interface EmptyLinks {
	/** Empty object that's never used but in here for completeness */
	readonly self: [Record<string, never>];
}

export type BaseFeedItem = ReadonlyDeep<{
	_links: EmptyLinks;
	/** ETag is always null so kind of pointless but kept here for completeness */
	eTag: null;
	/** Full ISO date string like `2021-04-15T08:18:13.7945978Z` */
	lastModified: string;
}>;

/**
 * The raw object that comes back from the feed
 */
export type ProductLiteRaw = BaseFeedItem &
	ReadonlyDeep<{
		_links: EmptyLinks & {
			"nice.publications:productfeed": Link[];
		};
		ETag: null;
		Id: string;
		Title: string;
		ProductStatus: ProductStatus;
		ProductType: ProductTypeAcronym;
		/** ISO date string like `2017-07-06T00:00:00`. Notice it's a rounded time because it's set manually by an editor. */
		PublishedDate: string;
		/** ISO date string like `2017-07-06T00:00:00` or `2021-05-21T10:54:52.4655487`. */
		LastMajorModificationDate: string;
		AreasOfInterestList: AreaOfInterestAcronym[];
		DevelopedAs: DevelopedAsProductTypeAcronym | null;
		RelevantTo: RelevantToProductTypeAcronym[];
		ProductGroup: ProductGroup;
	}>;

/** A product lite from the feed, but with redundant properties removed */
export type ProductLite = Except<ProductLiteRaw, "ETag" | "_links">;

export type ProductType = BaseFeedItem &
	ReadonlyDeep<{
		enabled: boolean;
		name: string;
		pluralName: string;
		identifierPrefix: ProductTypeAcronym;
		group: ProductGroup;
		parent: ParentProductTypeAcronym | "";
	}>;

export type AreaOfInterest = BaseFeedItem &
	ReadonlyDeep<{
		Enabled: boolean;
		Name: string;
		PluralName: string;
	}>;

type FeedContent<
	TEmbeddedOuter extends string,
	TEmbeddedInner extends string,
	TItemType
> = Readonly<{
	_links: Readonly<{
		self: Link[];
	}>;
	_embedded: Readonly<{
		[key in TEmbeddedOuter]: Readonly<{
			_links: Readonly<{
				self: ReadonlyArray<Link>;
			}>;
			_embedded: Readonly<{
				[key in TEmbeddedInner]: TItemType[];
			}>;
			ETag: null;
		}>;
	}>;
	ETag: string | null;
	LastModified: string;
}>;

export type AreasOfInterestList = FeedContent<
	"nice.publications:area-of-interest-type-list",
	"nice.publications:area-of-interest-type",
	AreaOfInterest
>;

export type ProductTypeList = FeedContent<
	"nice.publications:product-type-list",
	"nice.publications:product-type",
	ProductType
>;

export type ProductListLite = FeedContent<
	"nice.publications:product-list-lite",
	"nice.publications:product-lite",
	ProductLiteRaw
>;

export type ProductChapter = {
	title: string;
	url: string;
};

export type HTMLChapterContentInfo = {
	title: string;
	chapterSlug: string;
	_links: { self: [Link] };
};

export type HTMLChapterContent = {
	content: string;
};

export type ProductDetail = {
	chapterHeadings?: ProductChapter[];
	_embedded: {
		"nice.publications:content-part-list": {
			_embedded: {
				"nice.publications:upload-and-convert-content-part": {
					_embedded: {
						"nice.publications:html-content": {
							_embedded: {
								"nice.publications:html-chapter-content-info": HTMLChapterContentInfo[];
							};
						};
					};
				};
			};
		};
	};
	id: string;
	lastUpdatedDate?: string;
	productType: string;
	publishedDate?: string;
	summary?: string;
	title: string;
};

export type ErrorResponse = {
	StatusCode: string;
	Message: string;
};
