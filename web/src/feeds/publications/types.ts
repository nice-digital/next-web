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
}

export enum ProductTypeAcronym {
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

export interface BaseFeedItem {
	readonly _links: EmptyLinks;
	/** ETag is always null so kind of pointless but kept here for completeness */
	readonly ETag: null;
	/** Full ISO date string like `2021-04-15T08:18:13.7945978Z` */
	readonly LastModified: string;
}

export interface ProductLite extends BaseFeedItem {
	readonly _links: EmptyLinks & {
		readonly "nice.publications:productfeed": Link[];
	};
	readonly Id: string;
	readonly Title: string;
	readonly ProductStatus: ProductStatus;
	readonly ProductType: ProductTypeAcronym;
	/** ISO date string like `2017-07-06T00:00:00`. Notice it's a rounded time because it's set manually by an editor. */
	readonly PublishedDate: string;
	/** ISO date string like `2017-07-06T00:00:00` or `2021-05-21T10:54:52.4655487`. */
	readonly LastMajorModificationDate: string;
	readonly AreasOfInterestList: AreaOfInterestAcronym[];
	readonly DevelopedAs: DevelopedAsProductTypeAcronym | null;
	readonly RelevantTo: RelevantToProductTypeAcronym[];
	readonly ProductGroup: ProductGroup;
}

export interface ProductType extends BaseFeedItem {
	readonly Enabled: boolean;
	readonly Name: string;
	readonly PluralName: string;
	readonly IdentifierPrefix: ProductTypeAcronym;
	readonly Group: ProductGroup;
	readonly Parent: ParentProductTypeAcronym | "";
}

export interface AreaOfInterest extends BaseFeedItem {
	readonly Enabled: boolean;
	readonly Name: string;
	readonly PluralName: string;
}

type FeedContent<
	TEmbeddedOuter extends string,
	TEmbeddedInner extends string,
	TItemType extends BaseFeedItem
> = {
	readonly _links: {
		readonly self: Link[];
	};
	readonly _embedded: {
		readonly [key in TEmbeddedOuter]: {
			readonly _links: {
				readonly self: ReadonlyArray<Link>;
			};
			readonly _embedded: {
				readonly [key in TEmbeddedInner]: readonly TItemType[];
			};
			readonly ETag: null;
		};
	};
	readonly ETag: string | null;
	readonly LastModified: string;
};

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
	ProductLite
>;
